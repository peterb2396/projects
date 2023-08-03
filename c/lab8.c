
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <signal.h>

int p2c[2], c2p[2];
int *in, *out; // pointers to pipes
int count = 0; // curent number

void ping();
void pong();
void sig_handler(int);

int main () {

  if (pipe(p2c) == -1) { // creates parent to child pipe and checks for error
    perror("pipe");
    exit(1); // terminates with status 1
  }
  if (pipe(c2p) == -1) { // creates child to parent pipe and checks for error
    perror("pipe");
    exit(1);
  }

  int pid = fork(); // creates a child process
  if (pid < 0) { // checks for error
    perror("fork");
    exit(1);
  }
  
  signal(SIGUSR1 ,sig_handler);
  
  count = 0;
  if (pid > 0) { // parent process  
    while (1) { // keeps hitting the count if the value is positive 
      //count = hit('p'); 
      ping();
    }
  } else { //child process
    
    pong();
  }
  

  return 0;
}

void pong()
{
	while (1) { // keeps hitting the count if the value is 0 (child)
      printf("pong - %d\n", count++);
      in = &p2c[0]; // will read from p2c[0]
   	  out = &c2p[1]; // will write to c2p[1]
   	  write(*out, &count, sizeof(count)); // writes the new value in pipe for the other process
    }
}
void ping()
{
write(c2p[1], &count, sizeof(count)); // writes the initial value for the parent process to begin with
while (count <= 100)
{
	in = &c2p[0]; // will read from c2p[0]
    out = &p2c[1]; // will write to p2c[1]
	printf("ping - %d\n", count++);
	write(*out, &count, sizeof(count)); // writes the new value in pipe for the other process
}
	close(*in);
    close(*out);
	exit(0);
	
}

void sig_handler(int signum)
{
	printf("Pong quitting");
	exit(0);
}