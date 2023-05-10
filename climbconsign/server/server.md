# ClimbConsign Backend Server
https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/

Store images in database
https://stackoverflow.com/questions/34485420/how-do-you-put-an-image-file-in-a-json-object

How can we force pairs of items to be sold together? 
- On entry, physically bind them (zip tie, rubber band, etc)
- Multiple barcodes that need to be scanned. Either split the cost evenly (user error likely), force both items to be scanned to be sold together


On /v1/items (when fetching items which will happen on startup or refresh, check for any sales that match)