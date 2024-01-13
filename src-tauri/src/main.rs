// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::collections::HashMap;
use trash;
use dupefinder::DupeFinder;
use dupefinder::Duplicate;
 
fn main() {

  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![search_duplicates, delete_duplicate, read_file])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[derive(serde::Serialize)]
struct DuplicateFile {
  original_index: usize,
  files: Vec<String>,
  hash: String,
  size: f64, // size in MB
}

impl DuplicateFile {
  pub fn new(details: &Duplicate) -> DuplicateFile {
    let mut fsize = details.size as f64 / 1048576.0;
    fsize = (fsize * 100.0).round() / 100.0;
    DuplicateFile{
      files: details.files.clone(), 
      hash: details.hash.clone(), 
      original_index: 0,
      size: fsize,
    }
  }
}

#[tauri::command]
fn delete_duplicate(path: String) -> bool {
  trash::delete(path).is_ok()
}

#[tauri::command]
fn read_file(path: String) -> String {
  std::fs::read_to_string(path).unwrap_or(String::from("Unable to read file contents"))
}

#[tauri::command]
async fn search_duplicates(directories: Vec<String>, recursive: bool) -> Vec<DuplicateFile> {
  let mut ret: Vec<DuplicateFile> = Vec::new();
  let mut check = match recursive {
    true => DupeFinder::new_recursive(directories),
    false => DupeFinder::new(directories),
  };

  let results: HashMap<String, Duplicate> = check.run();
  for key in results.keys() {
    let result = results.get(key);
    if let Some(details) = result {
        ret.push(DuplicateFile::new(details));
      
    }
  }

  ret
}
