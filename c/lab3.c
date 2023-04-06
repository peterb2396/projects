#include <stdio.h>
int main()
{
	char string[25];
	int length = 0;
	char current;
	
	printf("Enter a string: ");
	scanf("%[^\n]s", string);
	
	while (string[length] != '\0')
		length++;
		
	printf("%d\n", length);
}