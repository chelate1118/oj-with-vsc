# OJ With : Plugin Project for Problem Solving

**OJ With** is a plugin for Visual Studio Code for problem-solving and supports online judges such as BOJ, Codeforces, and AtCoder.

## Why "OJ With"?
This plugin is designed for PS. With **OJ With**, you can test your code automatically.

## How to use

Create the file with extension '.ojw'. Then you will see the notebook. You can add a test case for each cell. Write down the input, '==', and the output. If you want, you can leave the output blank.

If you press the 'run' button on the left side of the cell, your code will be executed, and your input will be as stdin. The extension then automatically detects the output and compares it to the output which user defined.

When you press the 'run all' button on the top side of the screen, all test cases will be executed. The compilation runs only once.

## Requirements

You need g++ compiler for use this extension. To make sure that the g++ compiler is installed on your computer, type following line.

<code>g++ --version</code>

If you see 'g++ command not found', then you have to install g++ compiler and set to your PATH variable.

## Extension Settings

You can customize separator which divides input and output.

For example:

* `"oj-with.separator": "--"`
