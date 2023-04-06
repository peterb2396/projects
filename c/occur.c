#include <stdio.h>
int main()
{
	int count = 0;
	char target = '9';
	
	char s[] = "9190";
	for(int i = 0; s[i]; i++)
	{
		if(s[i] == target)
			count++;	
	}
	printf("Num of %c: %d\n",target, count);
}