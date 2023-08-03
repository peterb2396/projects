#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <netinet/in.h>
#include <netdb.h>
#include <arpa/inet.h>
#include <sys/wait.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>

#define SA struct sockaddr 

char args[2][100];
char path[200];
int server_socket, client_socket;
int PORT = 8013;
void doRequest();
void serverStart();
void requestLoop(int);


int main(int argc, char *argv[])
{
	strcpy(path, argv[1]); //set path
	serverStart();
}

void serverStart()
{
	unsigned int address_size;
	struct sockaddr_in servaddr, cli_addr;

	// socket
	server_socket = socket(AF_INET, SOCK_STREAM, 0);
	bzero(&servaddr, sizeof(servaddr));

	//server stuff
	servaddr.sin_family = AF_INET;
	servaddr.sin_addr.s_addr = htonl(INADDR_ANY);
	servaddr.sin_port = htons(PORT);

	int n = bind(server_socket, (SA*)&servaddr, sizeof(servaddr));
	if (n != 0) 
	{
		printf("Socket could not bind, try a new port. \n");
		return;
	}
	
	listen(server_socket, 5);
	
	printf("Server listening @ 0.0.0.0 with port %d.. \n", PORT);
	address_size = sizeof(cli_addr);

	client_socket = accept(server_socket, (SA*)&cli_addr, &address_size);

	if (client_socket < 0)
	{
		printf("Server could not accept client\n");
		return;
	}
	else 	printf("Client was accepted\n");
	requestLoop(client_socket);
	// finally
	close(server_socket);
}


void requestLoop(int client_socket)
{
	while(1)
	{
		char request[100]; 
		bzero(request, sizeof(request));
		read(client_socket, request, sizeof(request)); //from client
		
  		char * token = strtok(request, " ");
  		strcpy(args[0], token);
  		
  		token = strtok(NULL, "\n");
  		strcpy(args[1], token);
  		
  		//check if too many args
  		char *too_many;
    	too_many = strstr(args[1], " ");
   		if (too_many)
   		{
   			write(client_socket, "Format: GET [path]\n", 20);
   		}
   		else
   		{
   			doRequest();
   		}
  		
   	}
}

void doRequest ()
{
	//put file on server path
	char full_path[BUFSIZ];
	sprintf(full_path, "%s/%s", path, args[1]);
	
	char response[BUFSIZ];
	bzero(response, sizeof(response));

	//try to open our request
	int requested_file;
	if((requested_file = open(full_path, O_RDONLY)) == -1)
	{
		strcat(response, "Error 404\n\n");
		write(client_socket, response, strlen(response));
	}
	else
	{
		//response is valid, show it
		char response[BUFSIZ];
		sprintf(response, "HTTP/1.1 200 OK\n\n");

		char file_content[BUFSIZ];
		read(requested_file, file_content, sizeof(file_content));
		
		char file_length_header[BUFSIZ];
		sprintf(file_length_header, "Content-Length: %zu\n\n", strlen(file_content));
		sprintf(response, "%s%s\n\n", file_length_header, file_content);

		write(client_socket, response, strlen(response));
		close(requested_file);
	}
}
