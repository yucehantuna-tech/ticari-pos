#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rusqlite::{Connection, params};
use serde::{Serialize, Deserialize};
use std::path::PathBuf;
use tauri::Manager;

fn db_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
  let mut dir = app
    .path()
    .app_data_dir()
    .map_err(|e| e.to_string())?;

  std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
  dir.push("ticari_pos.sqlite");
  Ok(dir)
}

fn init_db(conn: &Connection) -> Result<(), String> {
  conn.execute(
    "CREATE TABLE IF NOT EXISTS products(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      barcode TEXT,
      price REAL NOT NULL
    )",
    []
  ).map_err(|e| e.to_string())?;
  Ok(())
}

#[derive(Serialize, Deserialize)]
struct Product {
  id: i64,
  name: String,
  barcode: Option<String>,
  price: f64,
}

#[tauri::command]
fn product_add(app: tauri::AppHandle, name: String, barcode: Option<String>, price: f64) -> Result<(), String> {
  let path = db_path(&app)?;
  let conn = Connection::open(path).map_err(|e| e.to_string())?;
  init_db(&conn)?;

  conn.execute(
    "INSERT INTO products(name, barcode, price) VALUES (?1, ?2, ?3)",
    params![name, barcode, price]
  ).map_err(|e| e.to_string())?;
  Ok(())
}

#[tauri::command]
fn product_list(app: tauri::AppHandle) -> Result<Vec<Product>, String> {
  let path = db_path(&app)?;
  let conn = Connection::open(path).map_err(|e| e.to_string())?;
  init_db(&conn)?;

  let mut stmt = conn
    .prepare("SELECT id, name, barcode, price FROM products ORDER BY id DESC")
    .map_err(|e| e.to_string())?;

  let rows = stmt.query_map([], |r| {
    Ok(Product{
      id: r.get(0)?,
      name: r.get(1)?,
      barcode: r.get(2)?,
      price: r.get(3)?,
    })
  }).map_err(|e| e.to_string())?;

  let mut out = vec![];
  for r in rows { out.push(r.map_err(|e| e.to_string())?); }
  Ok(out)
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![product_add, product_list])
    .run(tauri::generate_context!())
    .expect("error while running app");
}
