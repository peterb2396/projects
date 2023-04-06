#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#include <arpa/inet.h>
#include <sys/wait.h>
#include <signal.h>
#include <sys/stat.h>
#include <dirent.h>
#include <fcntl.h>
#include <pthread.h>

#define PORT 8000
#define MAXF 30
#define MAX_ARGS 3
#define MAX_REQ 10
#define SA struct sockaddr


//---------Global Vars---------//
int fd;
int servsockfd;//server sock fd
int clientsockfd;//client sock fd
int threadNum = 0;//number of threads
char reqArgs[MAX_REQ][MAX_ARGS][256];

//-------Prototypes-------//

//Server Commands-----//
void startServer();
void reqCmnds(int sockfd);
void processCmnds();
void *thr_func(void *);
void changedir(char *in); 
void checkdir(char *in);
char *fileProcess(char *source);

//Client Commands----//
void clientMode(char *addr, char *port);
void sendCmnds(int sockfd);
void printHTTP(int sockfd);

//File Commands-----//
// changedir()

typedef struct _thread_data_t 
{
  int tid;
  char args[MAX_ARGS-1][256];
} thread_data_t;

//Signal handler for ctrl+C----//
void signal_handler(int sig){
	printf("Socket closed\n");fflush(stdout);
	close(servsockfd);
	exit(1);
}
/**
	List of to do
	1) check if currect num of args
	2)check if server or client
		a) if args is 2 is server, 3 is client
	3.1) If server
		a)start server
		b)create 2D array to hold requests
		c)process requests


*/
int main(int argc, char *argv[]){
	
	//check args-----// Should be 2 or 3
	if(argc != 2 && argc != 3){
		printf("Usage: ./P4 [directory] or ./P4 [Address] [Port]\n");fflush(stdout);
		exit(1);
	}
	
	//check args----// 2 for server 3 for client
	if(argc == 2){//server
		checkdir(argv[1]);
		startServer();// a)start server
		

		
		// c)get requests, split into three, and put in 3d array
		reqCmnds(clientsockfd);
		for(int x = 0; x < threadNum; x++){// prints requests, not incliuding done
			/*printf("Request#: %d ", x);fflush(stdout);
			for(int y = 0; y < MAX_ARGS; y++){
				printf("arg: %d: %s ", y, reqArgs[x][y]);fflush(stdout);
			}
			printf("\n");fflush(stdout);*/
		}
		
		processCmnds();
		
		
		close(servsockfd);
		
	}
	else{//client, if argc =- 3
		clientMode(argv[1],argv[2]);
		
		sendCmnds(servsockfd);
		
		printHTTP(servsockfd);
		close(servsockfd);
	}
	
	
	
	
}

//------------SERVER FUNCTIONS------------//

/**
	List of to do
	1)create server
	2)bind server
	3)listen for connection
	4)accept client

*/
void startServer(){
	unsigned int len;//lenth of addr when initialized
	struct sockaddr_in serverAddr, clientAddr;//Addr for server than client
	signal(SIGINT, signal_handler);//if hit Ctrl+C before accepting client
	
	//Create server----------------//
	if((servsockfd = socket(AF_INET, SOCK_STREAM, 0)) < 0){
		printf("Error creating socket\n");fflush(stdout);
		exit(1);
	}
	//printf("servsockfd: %d\n", servsockfd);fflush(stdout);
	
	//setting up server address---------//
	bzero(&serverAddr, sizeof(serverAddr));//clear memory of servAddr
	serverAddr.sin_family = AF_INET;//set .sin_family to IPv4
	serverAddr.sin_port = htons(PORT);//set .sin_port to predefined PORT
	serverAddr.sin_addr.s_addr = htonl(INADDR_ANY);//set sin_addr to any put in(unspecified client)
	
	
	//bind server---------//
	if(bind(servsockfd, (SA*)&serverAddr , sizeof(serverAddr)) != 0){
		printf("Error binding to socket");fflush(stdout);
		exit(1);
	}
	
	
	//listen for connection----//
	if(listen(servsockfd, 5) != 0){
		printf("Error listening to socket");fflush(stdout);
		exit(1);
	}	
		//to get server address for printing----//
	struct in_addr ipAddr = serverAddr.sin_addr;
	char str_ip[INET_ADDRSTRLEN];
	inet_ntop( AF_INET, &ipAddr, str_ip, INET_ADDRSTRLEN );
 
	printf("Server listening at %s on %d..\n",str_ip, PORT);fflush(stdout);
	
	//accept client-------------//
	len = sizeof(clientAddr);
	clientsockfd = accept(servsockfd, (struct sockaddr*) &clientAddr, &len);
	if(clientsockfd < 0){
		printf("Error acccepting socket");fflush(stdout);
		exit(1);
	}	
	else{
		printf("Client accepted\n");fflush(stdout);
	}
}

/**
	List of things to do
	1)infinite loop for getting requests
		a)empty buff and temp
		b)read in request and remove new line
		c)check if DONE


*/
void reqCmnds(int sockfd){
	signal(SIGINT, signal_handler);
	
	//char temp[BUFSIZ];
	
	int c = 1;
	//printf("c : %d\n", c);fflush(stdout);
	while(c){
		char buff[256]; //user input
		memset(buff, '\0', sizeof(buff));
		//bzero(temp, sizeof(temp));
		
		read(sockfd, buff, sizeof(buff));
		printf("buff from client: %s\n", buff);fflush(stdout);
		
		char * token = strtok(buff, " ");
		int argN = 0;
		
		while(token != NULL){
			strcpy(reqArgs[threadNum][argN++], token);
			if(argN > MAX_ARGS){
				break;
			}
			if(argN == MAX_ARGS-1){
				token = strtok(NULL, "\n");
			}	
       		else{
            	token = strtok(NULL, " ");
			}
			
		}
		if(argN != MAX_ARGS){
			if(strcmp(reqArgs[threadNum][0], "DONE\n") == 0){
				printf("DONE\n");fflush(stdout);
				char done[] = "DONE";
				write(sockfd, done, sizeof(done)); //if done sumbitiing requests
				c--;	
			}
		}
		if(strcmp(reqArgs[threadNum][0], "GET") == 0){
			char contin[] = "Cont";
			write(sockfd, contin, sizeof(contin)); 
			threadNum++;
		}
		/*
		char *buffStr = strtok(buff, "\n");//all 3 w/o \n
		printf("buffStr: %s\n", buffStr);fflush(stdout);
		
		
		
		strcpy(temp, buffStr);//temp = all 3 w/o \n
		//printf("temp: %s\n", temp);fflush(stdout);
		
		char delim[] = " ";
		
		char *tempStr = strtok(temp, delim);//1st , temp = 2nd and 3rd w/o \n
		
		if(strcmp(tempStr, "DONE") == 0){
			printf("DONE\n");fflush(stdout);
			char done[] = "DONE";
			write(sockfd, done, sizeof(done)); 
			c--;
		}
		if(strcmp(tempStr, "GET") == 0){
			char contin[] = "Cont";
			write(sockfd, contin, sizeof(contin)); 
			strcpy((*in)[threadNum++], buffStr);
		}
		//strcpy((*in)[threadNum++], buffStr); //no "\n"
		//printf("c : %d\n", c);fflush(stdout);*/
	}
	
	/*
	char buff[BUFSIZ];
	char temp[BUFSIZ];
	

	int c = 1;
	while(c){
		// a)
		bzero(buff, sizeof(buff));
		bzero(temp, sizeof(temp));
		
		// b)
		read(sockfd, buff, sizeof(buff));
		printf("From client: %s\n", buff);
		char *buffStr = strtok(buff, "\n");
		
		//c)
		strcpy(temp, buffStr);
		char delim[] = " ";
		char *tempStr = strtok(temp, delim);
		if(strcmp(tempStr, "DONE") == 0){
			printf("DONE\n");fflush(stdout);
			char done[] = "DONE";
			write(sockfd, done, sizeof(done)); 
			c = 0;;
		}
		strcpy((*in)[threadNum++], buffStr);
		char contin[] = "Cont";
		write(sockfd, contin, sizeof(contin)); 
		printf("From client: %s\n", buffStr);
	}*/
}

void processCmnds(){
	pthread_t thr[threadNum];
    thread_data_t thr_data[threadNum];
	
	for(int x = 0; x < threadNum; ++x){
		thr_data[x].tid = x;
		
		for(int y = 0; y < MAX_ARGS-1; y++){
			//printf("THREAD %d, ARG #%d: %s\n", x, y, reqArgs[x][y+1]);
			strcpy(thr_data[x].args[y], reqArgs[x][y+1]);
		}
		//Make the thread with the complete structure
    	pthread_create(&thr[x], NULL, thr_func, &thr_data[x]);	
	}
	 /* block until all threads complete */
     for (int z = 0; z < threadNum; ++z){
  	 	pthread_join(thr[z], NULL);
	} //finished processing each request
	char f[] = "finish";
	write(clientsockfd, f, sizeof(f));
}

//Thread Function (for each request)
void *thr_func(void *arg)
{
	//Cast the argument (from creation) to store req arguments
    thread_data_t *data = (thread_data_t *)arg;
	//write this to client
	char label[BUFSIZ];
	bzero(label, sizeof(label));
	sprintf(label, "Request Thread #%d: ", data->tid + 1);
	//strcat(label, " ");
	strcat(label, data->args[1]);
	
	//get current dir 
	char buff[BUFSIZ];
	bzero(buff, sizeof(buff));
	getcwd(buff, sizeof(buff));
	char temp[BUFSIZ];
	strcpy(temp, buff);
	//append file to current dir
	strcat(temp, data->args[1]);
	//printf("file path: %s\n", temp);fflush(stdout);
	//write(clientsockfd, buf, sizeof(buf));
	
	//open file, read, close
	if((fd = open("file.rtf", O_RDONLY)) == -1){// open file at temp
		//write to client
		char error[] = "Error 404\n";
		strcat(label, error);
		write(clientsockfd, label, sizeof(label));
		//printf("file path: %s\n", temp);fflush(stdout);
		//404 error here
	}
	else{
		//send to client make one big str:
		//printf("fd of read file: %d\n", fd);fflush(stdout);
		char buf[BUFSIZ];
		strcpy(buf, label);
		strcat(buf," HTTP/1.0 200 OK\n");
		
		char temp[BUFSIZ];
		read(fd, temp, sizeof(temp));// read file into buf
		
		char contL[BUFSIZ];
		bzero(contL, sizeof(contL));
		sprintf(contL, "Content-Length: %zu\n\n", strlen(temp));
		strcat(buf, contL);
		strcat(buf, temp);
		write(clientsockfd, buf, sizeof(buf));
		close(fd);
	}
 
    pthread_exit(NULL);
}


void checkdir(char *in){
	//check if destination is a directory
	char buff[BUFSIZ];
	//printf("current dir: %s\n", getcwd(buff, sizeof(buff)));fflush(stdout);
	struct stat pathdes;
	stat(in, &pathdes);
	if(S_ISDIR(pathdes.st_mode) != 1){
		printf("Destination isn't a dir\n");fflush(stdout);
		exit(1);
	}
	
	//change to specified directory
	DIR *dir;// directory variable
	if((dir = opendir(in)) == NULL){// opening dir dest
		printf("Failure to open directory\n");fflush(stdout);
		exit(1);
	}
	struct dirent *dirp;
	chdir(in);// changing working dir to destination
	//printf("current dir: %s\n", getcwd(buff, sizeof(buff)));fflush(stdout);	
}
void changedir(char *in){
	//check if destination is a directory
	char buff[BUFSIZ];
	//printf("current dir: %s\n", getcwd(buff, sizeof(buff)));fflush(stdout);
	struct stat pathdes;
	stat(in, &pathdes);
	if(S_ISDIR(pathdes.st_mode) != 1){
		printf("Destination isn't a dir\n");fflush(stdout);
		exit(1);
	}
	
	//change to specified directory
	DIR *dir;// directory variable
	if((dir = opendir(in)) == NULL){// opening dir dest
		printf("Failure to open directory\n");fflush(stdout);
		exit(1);
	}
	struct dirent *dirp;
	chdir(in);// changing working dir to destination
	//printf("current dir: %s\n", getcwd(buff, sizeof(buff)));fflush(stdout);
}


//-------------CLIENT FUNCTIONS------------//

/*


*/
void clientMode(char *addr, char *port){
	struct sockaddr_in serverAddr;
	
	//Create server----------------//
	if((servsockfd = socket(AF_INET, SOCK_STREAM, 0)) < 0){
		printf("Error creating socket\n");fflush(stdout);
		exit(1);
	}
	//print servsockfd after creation
	printf("servsockfd: %d\n", servsockfd);fflush(stdout);
	//Server creation complete------------//
	
	bzero(&serverAddr, sizeof(serverAddr));
	serverAddr.sin_family = AF_INET;
	serverAddr.sin_port = htons(atoi(port));
	serverAddr.sin_addr.s_addr = inet_addr(addr);
	
	if(connect(servsockfd, (SA*)&serverAddr, sizeof(serverAddr)) != 0){
		printf("connection with the server failed...\n");fflush(stdout);
		exit(1);
	}
	else{
		printf("Connected to the server..\n");fflush(stdout);
	}
	
	//close(servsockfd);	//-----//	Makes binding error, not sure why?
}

/**
	List of things to do
	1)infinite loop for sending requests
		a)empty buff
		b)read in request
		c)write request to server
		d)read in if done with requests or will continue

*/
void sendCmnds(int sockfd){
	signal(SIGINT, signal_handler);
	
	//char buff[] = "test";
	char buff[256], ch;
	int x;
	
	int c = 1;
	//while(c){
	//	printf("c : %d\n", c);fflush(stdout);
	//	c--;
	//}
	//printf("c : %d\n", c);fflush(stdout);
	while(c){
		bzero(buff, sizeof(buff));
		printf("\tTo Server : ");fflush(stdout);
		x = 0;
		ch = ' ';
		while(ch != '\n'){
			ch = getchar();
			//printf("read in char: %c\n", ch);fflush(stdout);
			buff[x] = ch;
			x++;
		}
		buff[x] = '\0';
		printf("Sent Command: %s\n", buff);fflush(stdout);
		write(sockfd, buff, sizeof(buff));
		
		bzero(buff, sizeof(buff));
		//printf("test\n");fflush(stdout);
		read(sockfd, buff, sizeof(buff));
		printf("test returned cmnd from server %s\n", buff);fflush(stdout);
		if(strcmp(buff, "DONE") == 0){
			printf("DONE\n");fflush(stdout);
			c--;
		}
		//printf("c : %d\n", c);fflush(stdout);	
	}
	/*char buff[BUFSIZ];
	int x;
	
	int c = 1;
	while(c){
		// a)
		bzero(buff, sizeof(buff));
		// b)
		printf("\tTo Server : ");fflush(stdout);
		x = 0;
		while(buff[x] = getchar() != '\n'){
			x++;
		}
		printf("sent command: %s\n", buff);fflush(stdout);
		// c)
		write(sockfd, buff, sizeof(buff));
		// d)
		bzero(buff, sizeof(buff));
		read(sockfd, buff, sizeof(buff));
		if(strcmp(buff, "DONE") == 0){
			printf("DONE\n");fflush(stdout);
			c = 0;
		}
	}*/
}

void printHTTP(int sockfd){
	char buff[BUFSIZ];
	
	int c = 1;
	while(c){
		bzero(buff, sizeof(buff));
		read(sockfd, buff, sizeof(buff));
		if(strcmp(buff, "finish") == 0){
			c--;
		}
		else{
			printf("%s\n\n", buff);fflush(stdout);
		}
	}
	
	
}

