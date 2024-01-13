# Copyz
Duplicate file finder GUI / utility for reviewing and deleting duplicates. Uses Tauri for lightweight platform agnostic frontend / Rust backend. 

Simple Next.js frontend.

# Usage
Choose directories to search and decide to search recursively or just the top level folder.
Review the results with a side by side comparison option. Keyboard shortcuts are available to quickly review and manage results (See Show Shortcuts button on results page)
![image](https://github.com/vgo0/copyz/assets/76693978/12298e63-20bd-4ed4-aca8-2c3d85261f4a)
![image](https://github.com/vgo0/copyz/assets/76693978/9deb92de-bdd1-4207-aed4-5290e941ab00)
![image](https://github.com/vgo0/copyz/assets/76693978/ef6ac18a-9f79-4214-a76f-2ab48fe7288c)
![image](https://github.com/vgo0/copyz/assets/76693978/26366686-589c-4e4f-866b-0ba78bb552ad)

# Local Dev
```
npm i
cargo install tauri-cli
cargo tauri dev
```

# Build
```
cargo tauri build
```
