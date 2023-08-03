#include<stdio.h>
#include<stdlib.h>
#include<sys/types.h>
#include<sys/dir.h>
#include<dirent.h>
#include<fcntl.h>
#include<unistd.h>
#include<string.h>

FILE* file; //Current file being read

int main()
{
	//Declarations
	void readFile(FILE*, char*);
	void searchInDirectory(char *, char *);
	
	searchInDirectory(".", "numbers.");
	printf("----------------------------\n");

}

void readFile(FILE* file, char * fileName) 
{
	char num[3];
	int sum = 0;

	while (fscanf(file, "%s", num) != EOF)
		sum += atoi(num);
	
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
            	file= fopen(dirStr, "r");
            	readFile(file, dirStr);
				fclose(file);
			}
    }
    closedir(dir);
}