#include <stdio.h>
int main()
{
//Count all numbers between a and b divisible by c
const int a = 83;
const int b = 134;
const int c = 7;

int count = 0;

//Increase count if n divisible by c
for (int n = a; n<=b; n++)
	if (n%c == 0)
		count++;
		
printf("There are %d numbers divisible by %d between %d and %d.", count, c, a, b);
}