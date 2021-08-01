# CTRL_HUB_Functions
- repository holds the back end firebase cloud functions for CTRL_HUB
- following basic tutorial https://firebase.google.com/docs/functions/get-started?authuser=0
- to run the emulator to test functions:    
```
firebase emulators:start
```
### Notes
- by default functions are exported from index.js
    - functions in other js files can be required in
- functions are stateless so need to read write to storage
- eventually get most of the functionality on server/functions
