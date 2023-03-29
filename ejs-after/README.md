# ejs version
I have switched to ejs, by request of Yasaswi

sudo apt updaste
sudo apt install npm
sudo apt install serve (??? maybe npm install serve...)
sudo npm install pm2@latest -g

may have to update node, will get warnings if i do. Usually install v12 by default and breaks mongoose.

in server:
sudo npm i
sudo pm2 start ./bin/www

in client:
sudo npm i
sudo npm run build
sudo pm2 serve build 3000 -spa

