# Vue tables stress test
### Here I use Vue-CLI 3, VueX, Vue-router, Jest unit tests
Table rendering example with a lot of functionality inside
- The main purpose is test Vue processing with a lots of data
- 1000 rows for table with reactive variables + checkboxes and selectboxes in each row, finally > 3000 watchers on the page: common situation but very expensive for js frameworks
- The first page (Data A) contains Table component: resizable table with css bootstrap 4 styling and sorting by field (`src/components/Table.vue`)
```html
   <Table v-resizable v-lazy-load :loading-completed="loading" perPage="5" info />
```
 - The second page (Data B) contains Bootstrap-Vue table component + Bootstrap-Vue components for select box and checkbox and the same functionality (`src/components/TableVueBootstrap.vue`)
 ```html
   <TableBootstrapVue :loading-completed="loading" perPage="10" info pagination />
 ```
- Child component `src/components/TableInfo.vue`
```html
   <TableInfo vuexModel="Table" :shownRowsAmount="items.length" perPage="7" />
```
- Directives for tables added
```
v-lazy-load
v-resizable
```
 Info block where you can 
  + search through table
  + show rows counter, visible rows counter, pages amount (statistics) 
  + dynamically change the load Mode ('pagination', 'lazyload', 'handle load' or show all data at once)
  + change rows amount when pagination is active
  + check-in all items on page with one click
  + show only checked items
  + sort table data by fields

-------------------------------------------
## Project setup
```
git clone https://github.com/alexvillin/Vue-tables-stress-test.git
cd ./Vue-tables-stress-test
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```
Don't mind on eslint errors, just open page in browser (by default localhost:8080)

-----------------------------------------
## Task requirements


- Create a project on VueJs with two pages.
- The transition between pages takes place using the button named "Data A", "Data B". When switching to another page, the address bar should be changed.
- First, the data is displayed with data1.json, on the second - with data2.json.
- Data is displayed as a table. Perform the table as a component.
- The data in the table is displayed in batches of 50 pieces, with scrolls - to supplement. (endless scroll)
- Columns should resize as in video (resizable columns). The size should be saved when reloading the page.
- The height of the line should vary depending on the data in the "transcription" field.
- Implement a search box with filtering in all fields.
- Implement select, which changes the "status" data value.
- Depending on the selected status, the color of the marker will change in the "Status" column: 
```
0/1 - green
2 - yellow
3rd - red
4 - gray
5 - blue
6 - orange
7 - black
8 - darkred
9 - lightgrey
```
- With checkbox you can select rows to display. (see checkBox.mp4)
- The "Date and time" field must be formatted, taking into account the following conditions
- If the start / end fields match - show as one date.
- If they do not match - like 2 dates.
- If the time of the date "00:00:00" is only the year / month / day.
