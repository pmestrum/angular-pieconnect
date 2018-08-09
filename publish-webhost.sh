#!/bin/bash
HOST=files.000webhost.com
USER=pie-connect
PASSWORD=PIEconnect1

ftp -inv $HOST <<EOF
user $USER $PASSWORD
lcd dist
mdelete *.html
mdelete *.css
mdelete *.js
mput *.html
mput *.js
mput *.css
bye
EOF
