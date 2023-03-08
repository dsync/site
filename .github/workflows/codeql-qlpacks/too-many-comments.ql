/**
 * @name Too many comments
 * @description Reports when more than 5% of the lines in a file are comments.
 * @kind problem
 * @id js/comments-threshold
 * @tags maintainability
 */
import javascript
import Percentage

// Adjust this threshold as needed
let threshold = 5.0

// Find all files in the codebase
from File file
where file.hasLines()

// Find all comment lines in the file
let commentLines = file.getCommentLines()

// Calculate the percentage of comment lines in the file
let percentage = Percentage.divide(commentLines, file.getLineCount())

// Report an issue if the percentage exceeds the threshold
where percentage > threshold
select file, percentage, "Too many comments"
