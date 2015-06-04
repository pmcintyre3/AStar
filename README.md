# A Star Algorithm
Written by Phillip McIntyre Jr
2015

Canvas/JavaScript/HTML5

## Description
This website is used to simulate the A Star Algorithm and how it determines
the best path. Users can interactively add/remove obstacles and swap around
start and end paths. It can also simulate Dijkstra's Algorithm as well.

## How Do I Do This?
The instructions on the right side of the screen is all you need to know. 
Clicking the black spaces on the grid change them into obstacles, which make
them ineligible for traversing in the algorithm. Use these to make the algorithm
solution more complicated! Clicking the start or end spaces will remove them from
the grid. Make sure you add them back (wherever you like) before simulating.

## Known issues
The mouse coordinates, depending on the browser and its zoom level, can be inaccurate.
This is a known issue an I am currently working on a fix. In the mean time, playing
with the zoom on the browser can temporarily fix this issue. It works best when the
grid fully encompasses the window without clipping.

## Version
2.0 Dijkstra's algorithm added in with relevant
node color switching. Working on coordinate bug

>1.6.1 Fix for removing start/end after simulating
at least once

>1.6 Toggle displaying F, G, or ,H

>1.5 Added in Legend and instructions

>1.2 Added number boxes to change the number of rows
and columns

>1.1 Added menu next to canvas on the website

>1.0 A* Works!
