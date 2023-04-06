#include<stdio.h>
#include<stdlib.h>
#include<sys/types.h>
#include<sys/dir.h>
#include<dirent.h>
#include<fcntl.h>
#include<unistd.h>
#include<string.h>
void searchInDirectory(char *dirname){
    DIR *dir;
    struct dirent *dirp;
    dir=opendir(dirname);
    chdir(dirname);
    while((dirp=readdir(dir))!=NULL){
        if(dirp->d_type==4){
            if(strcmp(dirp->d_name, ".")==0 || strcmp(dirp->d_name, "..")==0){
                continue;
            }
            printf("%s %s\n", "FOLDER", dirp->d_name);
            searchInDirectory(dirp->d_name);
        }
        else{
            printf("%s %s\n", "FILE", dirp->d_name);
        }
    }
    chdir("..");
    closedir(dir);
}
int main(){
    searchInDirectory(".");
    return 0;
}