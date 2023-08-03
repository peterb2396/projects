#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <string.h>
#include <math.h>

int main()
{

	//Seed randomizer
	srand ( time(NULL) );

	//Declare variables
	const int COUNT = 100;
	const int RANGE = 100;
	int nums[COUNT];
	int sum = 0;

	//Generate and add number to sum and to array
	for (int i = 0; i<COUNT; ++i)
	{
		int n = rand()%RANGE;
		nums[i] = n;
		sum+=n;
	}

	int sumDigits = (int)ceil(log10(sum));
	
	//Create and fill file
	char filePrefix[] = "numbers.";
	char fileExtension[] = ".txt";
	char fileName[sizeof(filePrefix) + sizeof(fileExtension) + sumDigits - 1];
	char strSum[sumDigits];
	
	strcpy(fileName, filePrefix);
	sprintf(strSum, "%d", sum);
	strcat(fileName, strSum);
	strcat(fileName, fileExtension);
	
	FILE* output = fopen(fileName, "w");
	
	for (int i = 0; i<COUNT; ++i)
		fprintf(output, "%s%d\n", (nums[i]<10)? "0":"", nums[i]);
	
	//Display sum and close file
	printf("%d is the total\n",sum);
	fclose(output); //Technically not necessary since file closes on program end but good practice
}