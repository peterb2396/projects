#include<stdio.h>
#include <stdlib.h>

int main(int argc, char** argv)
{
	if (argc == 1)
	{
		printf("You must specify a number!\n");
		return 1;
	}
	
	int num, tempNum;
	num = tempNum = atoi(argv[1]);
	int count = 0;
	printf("Your number is %d.\n", num);
	
	while (tempNum > 0) {
		
        // Check if the first bit is one
        if (tempNum & 1)
            count++;
            
		// Move to the next bit by chopping off the first bit
        tempNum >>= 1;
    }

	//Display number of one bits in the given integer
    printf("%d has %d %s.\n", num, count, (count == 1) ? "one" : "ones");
	return 0;
}