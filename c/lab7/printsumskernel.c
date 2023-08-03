#include<stdio.h>
#include<stdlib.h>
#include<sys/types.h>
#include<sys/dir.h>
#include<dirent.h>
#include<fcntl.h>
#include<unistd.h>
#include<string.h>

int fd; //Current file being read

int main()
{
	//Declarations
	void readFile(char*);
	void searchInDirectory(char *, char *);
	
	searchInDirectory(".", "numbers.");
	printf("----------------------------\n");

}

void readFile(char * fileName) 
{
	char num[3];
	int sum = 0;

	//open file at kernel level
	fd = open(fileName, O_RDONLY);
	
	//read file at kernel level
	char buf[BUFSIZ];
	int fileLength; //byte size
	fileLength = read(fd, buf, BUFSIZ);
	
	for(int i = 0; i< fileLength; i+=3)
	{
		char digit1[2]; /* gives {\0, \0} */
		digit1[1] = '\0';
    	digit1[0] = buf[i];
		
		char digit2[2]; /* gives {\0, \0} */
		digit2[1] = '\0';
    	digit2[0] = buf[i + 1];
    	
    	char mydigit[3];
    	strcpy(mydigit, digit1);
    	strcat(mydigit, digit2);

		printf("%s\n", mydigit);
		sum+=atoi(mydigit);

	}
	
	printf("----------------------------\nFile name: %s\nSum of entries:    %d\n",fileName, sum);
}
 
void searchInDirectory(char *dirname, char *key){
    DIR *dir; //Directory
    dir=opendir(dirname);
     
    struct dirent *dirp;
    chdir(dirname);
    
    char comp2[sizeof(key)+1];
    
    //Comp2 will be the first sizeof(key)-1 characters of the current file in question
    
    while((dirp = readdir(dir)) != NULL)
    {
            //Compare first 8 characters
            char* dirStr = dirp->d_name;
            	
            //make comp2 prefix in question
            strncpy(comp2, dirStr, sizeof(key));
            	
            //If the prefix is correct... we found a number file!
            if (strcmp(comp2, key) == 0)
            {
            	readFile(dirStr);
				close(fd);
			}
    }
    closedir(dir);
}