<template>
    <div>
    <h3>HOME</h3>
    <pre>
    #Task requirements

    Create a project on VueJs with two pages.
    The transition between pages takes place using the button named "Data A", "Data B". When switching to another page, the address bar should be changed.
    First, the data is displayed with data1.json, on the second - with data2.json.
    Data is displayed as a table. Perform the table as a component.
    The data must be sorted by the "start" field.
    The data in the table is displayed in batches of 50 pieces, with scrolls - to supplement. (endless scroll)
    Columns should resize as in video (resizable columns). The size should be saved when reloading the page.
    The height of the line should vary depending on the data in the "transcription" field.
    Implement a search box with filtering in all fields.
    Implement select, which changes the "status" data value.
    Depending on the selected status, the color of the marker will change in the "Status" column: -0/1 - green

    2 - yellow
    3rd - red
    4 - gray
    5 - blue
    6 - orange
    7 - black
    8 - darkred
    9 - lightgrey

    With checkbox you can select rows to display. (see checkBox.mp4)
    The "Date and time" field must be formatted, taking into account the following conditions

    If the start / end fields match - show as one date.
    If they do not match - like 2 dates.
    If the time of the date "00:00:00" is only the year / month / day.

    The table should work without interruptions, freezes. Plus there will be a nice animation.
    </pre>
    </div>
</template>
