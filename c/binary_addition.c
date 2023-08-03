#include <stdio.h>
int main()
{
//Goal is to add two binary numbers via 2 arrays. 
//Add bits 0 for sum0. Add bits1 + carry0 for sum1.
//Finally, last bit is carry(n-1.

int a[] = {1,1,1,0};
int b[] = {1,0,1,1};

int carry = 0;
int length = sizeof(a)/sizeof(a[0]);
int c[length+1];

for (int i = length; i > 0; i--)
{
	int sum = (a[i-1] + b[i-1] + carry);
	c[i] = sum % 2;
	carry = sum / 2;
}
//At the first value, determined by last carry
c[0] = carry;
for (int i = 0; i<length+1; i++)
{
	printf("%d",c[i]);
}

return 0;
}