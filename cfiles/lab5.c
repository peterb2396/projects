#include <stdio.h>

int main()
{
    FILE* file = fopen("input.txt", "r");
    char word[25];

	while (fscanf(file, "%s", word) != EOF)
	{
		printf("%s\n", word);
	}
	
	fclose(file);
    return 0;
}