# Peter Buonaiuto 518 lab showcase
This website has a landing page as well as a page for each lab.

My deployed instance elastic address is: 
http://3.232.168.176:3000/

And my github classroom repo is:
https://github.com/ualbany-software-engineering/frontend-assignment-peterb2396.git

## ec2 instance deployment:
	sudo apt update
	sudo apt install node
	sudo npm install pm2@latest -g
	sudo apt install serve (or nom install serve??)

## Make a change:
    sudo pm2 stop all
    sudo pm2 delete all

Sudo git pull (in root)
### In server:
	sudo npm I
	sudo pm2 start ./bin/www
* (Maybe sudo pm2 deploy ./bin/www)? i made the deploy script use node whereas start probably still uses nodemon

#### In client:
	sudo npm i
	sudo npm run build
	sudo pm2 serve build 3000 -spa

## Check process locking port

    sudo lsof -i tcp:<port>
    sudo ps -faux (if previous command shows nothing, this will show the parent process spawning the locking child)
    kill -3 <pid>



# Start local database on macOS
    brew tap mongodb/brew
    brew install mongodb-community@4.4  
    echo 'export PATH="/usr/local/opt/mongodb-community@4.4/bin:$PATH"' >> ~/.zshrc

## Start in terminal
    /usr/local/opt/mongodb-community@4.4/bin/mongod --config /usr/local/etc/mongod.conf
* Or, start as background service
    brew services start mongodb/brew/mongodb-community

## Connect from another terminal
    cd /usr/local/opt/mongodb-community@4.4
    ./bin/mongo