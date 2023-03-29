#include <sys/wait.h>
#include <unistd.h>
#include <string.h>
#include <errno.h>
#include<signal.h>

int c = 0;
int pipe1[2];
int pipe2[2];
pid_t pidC1;
pid_t pidC2;

void ping();
void pong();

void signal_handler(int sig){
	printf("pong quitting\n");fflush(stdout);
	exit(1);
}

int main(){
	
	signal(SIGUSR1, signal_handler);
	
	pipe(pipe1);
	pipe(pipe2);
	
	pidC1 = fork();
	if(pidC1 == 0){//if child
		//b)
		ping();
	}
	else{//if parent
		pidC2 = fork();
		if(pidC2 == 0){//if child
			pong();
		}
		else{//if parent
			wait(NULL);
			pid_t parent = getpid();
			kill(parent, SIGUSR1);
		}
	}
	return 0;
}

void ping(){
	while(c < 100){
		printf("ping<%d>\n",c);fflush(stdout);
		c++;
		write(pipe1[1], &c, sizeof(c));	
		wait(NULL);
		read(pipe2[0], &c, sizeof(c));
	}
	exit(1);
}
void pong(){
	while(1){
		read(pipe1[0], &c, sizeof(c));
		printf("pong<%d>\n", c);fflush(stdout);
		c++;
		write(pipe2[1], &c, sizeof(c));
		wait(NULL);
	}
}