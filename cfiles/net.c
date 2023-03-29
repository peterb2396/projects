#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <string.h>
#include <netdb.h>
#include <sys/types.h>
#include <netinet/in.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <sys/wait.h>
#include <signal.h>

#define MAX 80
#define PORT 1234
#define SA struct sockaddr

//Interupt Handler - close down server
void handle_quit(int socket)
{
	close(socket);
	exit(1);
}

//Server char function
void serverMsg(int connfd)
{
	char buff[MAX];
	int n;
	// infinite loop for chat
	while(1) {
		bzero(buff, MAX);

		// read the message from client and copy it in buffer
		read(connfd, buff, sizeof(buff));
		// print buffer which contains the client contents
		printf("From client: %s\t To client : ", buff);
		bzero(buff, MAX);
		n = 0;
		// copy server message in the buffer
		while ((buff[n++] = getchar()) != '\n');

		// and send that buffer to client
		write(connfd, buff, sizeof(buff));

		// if msg contains "Exit" then server exit and chat ended.
		if (strncmp("exit", buff, 4) == 0) {
			printf("Shutting down...\n");
			break;
		}
	}
}

//Client chat function
void clientMsg(int sockfd)
{
	char buff[MAX];
	int n;
	while(1) {
		bzero(buff, sizeof(buff));
		printf("\tTo Server : ");
		n = 0;
		while ((buff[n++] = getchar()) != '\n')
			;
		write(sockfd, buff, sizeof(buff));
		bzero(buff, sizeof(buff));
		read(sockfd, buff, sizeof(buff));
		printf("From Server : %s", buff);
		if ((strncmp(buff, "exit", 4)) == 0) {
			printf("Server has been shut down.\n");
			break;
		}
	}
}

int main(int argc, char *argv[])
{
	if (argc != 3 && argc != 1)
	{
		printf("Usage: ./net to host, or ./net [address] [port] to connect\n");
		return EXIT_FAILURE;
	}
	
	int sockfd, connfd;
	unsigned int len;
	struct sockaddr_in servaddr, cli;
	
	if (argc == 1)
	{//HOSTING SERVER\
		//Bind SIGINT to close down server
		signal(SIGTSTP, handle_quit);
		// socket create and verification
		sockfd = socket(AF_INET, SOCK_STREAM, 0);
		if (sockfd == -1) {
			printf("socket creation failed...\n");
			exit(0);
		}
		bzero(&servaddr, sizeof(servaddr));

	// assign IP, PORT
	servaddr.sin_family = AF_INET;
	servaddr.sin_addr.s_addr = htonl(INADDR_ANY);
	servaddr.sin_port = htons(PORT);

	// Binding newly created socket to given IP and verification
	if ((bind(sockfd, (SA*)&servaddr, sizeof(servaddr))) != 0) {
		printf("socket bind failed...\n");
		exit(0);
	}

	// Now server is ready to listen and verification
	if ((listen(sockfd, 5)) != 0) {
		printf("Listen failed...\n");
		exit(0);
	}
	
	struct in_addr ipAddr = servaddr.sin_addr;
	char str_ip[INET_ADDRSTRLEN];
	inet_ntop( AF_INET, &ipAddr, str_ip, INET_ADDRSTRLEN );
	
	printf("Server listening at %s on %d..\n",str_ip, PORT);
	len = sizeof(cli);

	// Accept the data packet from client and verification
	connfd = accept(sockfd, (SA*)&cli, &len);
	if (connfd < 0) {
		printf("server accept failed...\n");
		exit(0);
	}
	else
		printf("Client accepted!\n");

	// Function for chatting between client and server
	serverMsg(connfd);

	// After chatting close the socket
	close(sockfd);
	}
//end server

	else //CLIENT
	{
	
	// socket create and verification
	sockfd = socket(AF_INET, SOCK_STREAM, 0);
	if (sockfd == -1) {
		printf("socket creation failed...\n");
		exit(0);
	}
	bzero(&servaddr, sizeof(servaddr));

	// assign IP, PORT
	servaddr.sin_family = AF_INET;
	servaddr.sin_addr.s_addr = inet_addr(argv[1]);
	servaddr.sin_port = htons(atoi(argv[2]));

	// connect the client socket to server socket
	if (connect(sockfd, (SA*)&servaddr, sizeof(servaddr)) != 0) {
		printf("connection with the server failed...\n");
		exit(0);
	}
	else
		printf("Connected to the server..\n");

	// function for chat
	clientMsg(sockfd);

	// close the socket
	close(sockfd);
	}
}