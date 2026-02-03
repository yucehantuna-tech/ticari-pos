#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rusqlite::{Connection, params};
use serde::{Serialize, Deserialize};
use std::path::PathBuf;
use tauri::Manager;

fn db_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
  let mut dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
  std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
  dir.push("ticari_pos.sqlite");
  Ok(dir)
}

fn open_db(app: &tauri::AppHandle) -> Result<Connection, String> {
  let conn = Connection::open(db_path(app)?).map_err(|e| e.to_string())?;
  init_db(&conn)?;
  Ok(conn)
}

fn init_db(conn: &Connection) -> Result<(), String> {
  conn.execute(
    "CREATE TABLE IF NOT EXISTS products(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      barcode TEXT,
      price REAL NOT NULL DEFAULT 0
    )", []
  ).map_err(|e| e.to_string())?;

  conn.execute(
    "CREATE TABLE IF NOT EXISTS customers(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT
    )", []
  ).map_err(|e| e.to_string())?;

  conn.execute(
    "CREATE TABLE IF NOT EXISTS sales(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
      customer_id INTEGER,
      total REAL NOT NULL,
      pay_cash REAL NOT NULL DEFAULT 0,
      pay_card REAL NOT NULL DEFAULT 0,
      pay_credit REAL NOT NULL DEFAULT 0,
      note TEXT,
      FOREIGN KEY(customer_id) REFERENCES customers(id)
    )", []
  ).map_err(|e| e.to_string())?;

  conn.execute(
    "CREATE TABLE IF NOT EXISTS sale_items(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER NOT NULL,
      product_id INTEGER,
      name TEXT NOT NULL,
      qty REAL NOT NULL,
      unit_price REAL NOT NULL,
      line_total REAL NOT NULL,
      FOREIGN KEY(sale_id) REFERENCES sales(id)
    )", []
  ).map_err(|e| e.to_string())?;

  conn.execute(
    "CREATE TABLE IF NOT EXISTS credits(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
      customer_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      note TEXT,
      sale_id INTEGER,
      FOREIGN KEY(customer_id) REFERENCES customers(id)
    )", []
  ).map_err(|e| e.to_string())?;

  conn.execute(
    "CREATE TABLE IF NOT EXISTS cash_movements(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
      kind TEXT NOT NULL,
      amount REAL NOT NULL,
      note TEXT,
      sale_id INTEGER
    )", []
  ).map_err(|e| e.to_string())?;

  Ok(())
}

#[derive(Serialize, Deserialize)]
struct Product { id: i64, name: String, barcode: Option<String>, price: f64, stock_qty: f64, low_stock: f64 }

#[derive(Serialize, Deserialize)]
struct Customer { id: i64, name: String, phone: Option<String> }

#[derive(Serialize, Deserialize)]
struct CartItemIn {
  product_id: Option<i64>,
  name: String,
  qty: f64,
  unit_price: f64
}

#[derive(Serialize, Deserialize)]
struct SaleCreateIn {
  customer_id: Option<i64>,
  items: Vec<CartItemIn>,
  pay_cash: f64,
  pay_card: f64,
  pay_credit: f64,
  note: Option<String>
}

#[derive(Serialize, Deserialize)]
struct KasaSummary {
  cash_in: f64,
  cash_out: f64,
  card_in: f64,
  net_cash: f64,
  total_sales: f64,
  total_credit: f64
}

#[derive(Serialize, Deserialize)]
struct SaleRow {
  id: i64,
  created_at: String,
  customer_name: Option<String>,
  total: f64,
  pay_cash: f64,
  pay_card: f64,
  pay_credit: f64,
}

#[derive(Serialize, Deserialize)]
struct SaleItemRow {
  name: String,
  qty: f64,
  unit_price: f64,
  line_total: f64,
}

/* -------- Products -------- */

#[tauri::command]
fn product_add(app: tauri::AppHandle, name: String, barcode: Option<String>, price: f64) -> Result<i64, String> {
  let conn = open_db(&app)?;
  conn.execute(
    "INSERT INTO products(name, barcode, price, stock_qty, low_stock) VALUES (?1, ?2, ?3, 0, 0)",
    params![name, barcode, price]
  ).map_err(|e| e.to_string())?;
  Ok(conn.last_insert_rowid())
}

#[tauri::command]
fn product_list(app: tauri::AppHandle) -> Result<Vec<Product>, String> {
  let conn = open_db(&app)?;
  let mut stmt = conn.prepare("SELECT id, name, barcode, price, stock_qty, low_stock FROM products ORDER BY id DESC")
    .map_err(|e| e.to_string())?;
  let rows = stmt.query_map([], |r| {
    Ok(Product{ id:r.get(0)?, name:r.get(1)?, barcode:r.get(2)?, price:r.get(3)?, stock_qty:r.get(4)?, low_stock:r.get(5)? })
  }).map_err(|e| e.to_string())?;
  let mut out = vec![];
  for x in rows { out.push(x.map_err(|e| e.to_string())?); }
  Ok(out)
}


#[tauri::command]
fn stock_add(app: tauri::AppHandle, product_id: i64, qty: f64, note: Option<String>) -> Result<(), String> {
  let conn = open_db(&app)?;
  conn.execute("UPDATE products SET stock_qty = stock_qty + ?1 WHERE id=?2", params![qty, product_id]).map_err(|e| e.to_string())?;
  conn.execute("INSERT INTO stock_movements(product_id, qty, type, note) VALUES (?1, ?2, 'in', ?3)", params![product_id, qty, note]).map_err(|e| e.to_string())?;
  Ok(())
}

#[tauri::command]
fn stock_set_low(app: tauri::AppHandle, product_id: i64, low_stock: f64) -> Result<(), String> {
  let conn = open_db(&app)?;
  conn.execute("UPDATE products SET low_stock=?1 WHERE id=?2", params![low_stock, product_id]).map_err(|e| e.to_string())?;
  Ok(())
}

/* -------- Customers -------- */

#[tauri::command]
fn customer_add(app: tauri::AppHandle, name: String, phone: Option<String>) -> Result<i64, String> {
  let conn = open_db(&app)?;
  conn.execute(
    "INSERT INTO customers(name, phone) VALUES (?1, ?2)",
    params![name, phone]
  ).map_err(|e| e.to_string())?;
  Ok(conn.last_insert_rowid())
}

#[tauri::command]
fn customer_list(app: tauri::AppHandle) -> Result<Vec<Customer>, String> {
  let conn = open_db(&app)?;
  let mut stmt = conn.prepare("SELECT id, name, phone FROM customers ORDER BY id DESC")
    .map_err(|e| e.to_string())?;
  let rows = stmt.query_map([], |r| {
    Ok(Customer{ id:r.get(0)?, name:r.get(1)?, phone:r.get(2)? })
  }).map_err(|e| e.to_string())?;
  let mut out = vec![];
  for x in rows { out.push(x.map_err(|e| e.to_string())?); }
  Ok(out)
}

#[tauri::command]
fn customer_balance(app: tauri::AppHandle, customer_id: i64) -> Result<f64, String> {
  let conn = open_db(&app)?;
  let mut stmt = conn.prepare(
    "SELECT COALESCE(SUM(CASE WHEN type='debit' THEN amount ELSE -amount END),0)
     FROM credits WHERE customer_id=?1"
  ).map_err(|e| e.to_string())?;
  let bal: f64 = stmt.query_row(params![customer_id], |r| r.get(0)).map_err(|e| e.to_string())?;
  Ok(bal)
}

#[tauri::command]
fn credit_payment(app: tauri::AppHandle, customer_id: i64, amount: f64, note: Option<String>) -> Result<(), String> {
  let conn = open_db(&app)?;
  conn.execute(
    "INSERT INTO credits(customer_id, amount, type, note) VALUES (?1, ?2, 'payment', ?3)",
    params![customer_id, amount, note]
  ).map_err(|e| e.to_string())?;
  conn.execute(
    "INSERT INTO cash_movements(kind, amount, note) VALUES ('cash_in', ?1, 'Veresiye Tahsilat')",
    params![amount]
  ).map_err(|e| e.to_string())?;
  Ok(())
}

/* -------- Sales -------- */

#[tauri::command]
fn sale_create(app: tauri::AppHandle, payload: SaleCreateIn) -> Result<i64, String> {
  let conn = open_db(&app)?;

  let mut total = 0.0;
  for it in &payload.items { total += it.qty * it.unit_price; }

  conn.execute(
    "INSERT INTO sales(customer_id, total, pay_cash, pay_card, pay_credit, note)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
    params![payload.customer_id, total, payload.pay_cash, payload.pay_card, payload.pay_credit, payload.note]
  ).map_err(|e| e.to_string())?;
  let sale_id = conn.last_insert_rowid();

    for it in payload.items {
    // stock out
    if let Some(pid) = it.product_id {
      conn.execute("UPDATE products SET stock_qty = stock_qty - ?1 WHERE id=?2", params![it.qty, pid]).map_err(|e| e.to_string())?;
      conn.execute("INSERT INTO stock_movements(product_id, qty, type, note, sale_id) VALUES (?1, ?2, 'out', 'Satış', ?3)",
        params![pid, it.qty, sale_id]
      ).map_err(|e| e.to_string())?;
    }
    let lt = it.qty * it.unit_price;
    conn.execute(
      "INSERT INTO sale_items(sale_id, product_id, name, qty, unit_price, line_total)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
      params![sale_id, it.product_id, it.name, it.qty, it.unit_price, lt]
    ).map_err(|e| e.to_string())?;
  }

  if payload.pay_cash > 0.0 {
    conn.execute(
      "INSERT INTO cash_movements(kind, amount, note, sale_id) VALUES ('cash_in', ?1, 'Satış Nakit', ?2)",
      params![payload.pay_cash, sale_id]
    ).map_err(|e| e.to_string())?;
  }
  if payload.pay_card > 0.0 {
    conn.execute(
      "INSERT INTO cash_movements(kind, amount, note, sale_id) VALUES ('card_in', ?1, 'Satış Kart', ?2)",
      params![payload.pay_card, sale_id]
    ).map_err(|e| e.to_string())?;
  }

  if payload.pay_credit > 0.0 {
    let cid = payload.customer_id.ok_or("Veresiye için müşteri seç!")?;
    conn.execute(
      "INSERT INTO credits(customer_id, amount, type, note, sale_id)
       VALUES (?1, ?2, 'debit', 'Veresiye Satış', ?3)",
      params![cid, payload.pay_credit, sale_id]
    ).map_err(|e| e.to_string())?;
  }

  Ok(sale_id)
}

#[tauri::command]
fn sales_recent(app: tauri::AppHandle, limit: i64) -> Result<Vec<SaleRow>, String> {
  let conn = open_db(&app)?;
  let mut stmt = conn.prepare(
    "SELECT s.id, s.created_at,
            (SELECT name FROM customers c WHERE c.id = s.customer_id) as customer_name,
            s.total, s.pay_cash, s.pay_card, s.pay_credit
     FROM sales s
     ORDER BY s.id DESC
     LIMIT ?1"
  ).map_err(|e| e.to_string())?;

  let rows = stmt.query_map(params![limit], |r| {
    Ok(SaleRow{
      id: r.get(0)?,
      created_at: r.get(1)?,
      customer_name: r.get(2)?,
      total: r.get(3)?,
      pay_cash: r.get(4)?,
      pay_card: r.get(5)?,
      pay_credit: r.get(6)?,
    })
  }).map_err(|e| e.to_string())?;

  let mut out = vec![];
  for x in rows { out.push(x.map_err(|e| e.to_string())?); }
  Ok(out)
}

#[tauri::command]
fn sale_items(app: tauri::AppHandle, sale_id: i64) -> Result<Vec<SaleItemRow>, String> {
  let conn = open_db(&app)?;
  let mut stmt = conn.prepare(
    "SELECT name, qty, unit_price, line_total
     FROM sale_items
     WHERE sale_id=?1
     ORDER BY id ASC"
  ).map_err(|e| e.to_string())?;

  let rows = stmt.query_map(params![sale_id], |r| {
    Ok(SaleItemRow{
      name: r.get(0)?,
      qty: r.get(1)?,
      unit_price: r.get(2)?,
      line_total: r.get(3)?,
    })
  }).map_err(|e| e.to_string())?;

  let mut out = vec![];
  for x in rows { out.push(x.map_err(|e| e.to_string())?); }
  Ok(out)
}

/* -------- Kasa -------- */

#[tauri::command]
fn kasa_summary(app: tauri::AppHandle) -> Result<KasaSummary, String> {
  let conn = open_db(&app)?;

  let cash_in: f64 = conn.query_row(
    "SELECT COALESCE(SUM(amount),0) FROM cash_movements WHERE kind='cash_in'",
    [], |r| r.get(0)
  ).map_err(|e| e.to_string())?;

  let cash_out: f64 = conn.query_row(
    "SELECT COALESCE(SUM(amount),0) FROM cash_movements WHERE kind='cash_out'",
    [], |r| r.get(0)
  ).map_err(|e| e.to_string())?;

  let card_in: f64 = conn.query_row(
    "SELECT COALESCE(SUM(amount),0) FROM cash_movements WHERE kind='card_in'",
    [], |r| r.get(0)
  ).map_err(|e| e.to_string())?;

  let total_sales: f64 = conn.query_row(
    "SELECT COALESCE(SUM(total),0) FROM sales",
    [], |r| r.get(0)
  ).map_err(|e| e.to_string())?;

  let total_credit: f64 = conn.query_row(
    "SELECT COALESCE(SUM(CASE WHEN type='debit' THEN amount ELSE -amount END),0) FROM credits",
    [], |r| r.get(0)
  ).map_err(|e| e.to_string())?;

  Ok(KasaSummary{
    cash_in,
    cash_out,
    card_in,
    net_cash: cash_in - cash_out,
    total_sales,
    total_credit
  })
}


fn pin_path(app: &tauri::AppHandle) -> Result<std::path::PathBuf, String> {
  let mut dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
  std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
  dir.push("admin_pin.txt");
  Ok(dir)
}

#[tauri::command]
fn auth_set_pin(app: tauri::AppHandle, pin: String) -> Result<(), String> {
  std::fs::write(pin_path(&app)?, pin).map_err(|e| e.to_string())?;
  Ok(())
}

#[tauri::command]
fn auth_check(app: tauri::AppHandle, pin: String) -> Result<bool, String> {
  let p = pin_path(&app)?;
  if !p.exists() { return Ok(pin == "1234"); } // ilk kurulum default
  let saved = std::fs::read_to_string(p).map_err(|e| e.to_string())?;
  Ok(saved.trim() == pin.trim())
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      product_add, product_list,
      customer_add, customer_list, customer_balance, credit_payment,
      sale_create, sales_recent, sale_items,
      kasa_summary
    ])
    .run(tauri::generate_context!())
    .expect("error while running app");
}




