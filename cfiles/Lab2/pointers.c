#include <stdio.h>

int main()
{
	int a = 0;
	int b = 0;
	
	int *ptr_a = &a;
	int *ptr_b = &b;
	
	
	printf("%d, %d", *ptr_a, *ptr_b);
	*ptr_b = 2;
	
	printf("A: %d\nB: %d\nPTR_A: %d\nPTR_B: %d",a, b, *ptr_a, *ptr_b);
}

//TASK 5: Systems allocate memory location all the time, and allocate it differently with each call, so the addresses will be different depending on current available memory.