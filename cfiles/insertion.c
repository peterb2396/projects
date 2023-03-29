#include <stdio.h>

int main()
{
int nums[] = {3,6,9,1,6,5,8,2};
int length = sizeof nums / sizeof *nums;

for (int i = 1; i<length; i++)
{
	int key = nums[i];
	int j = i - 1;
	
	while (j >= 0 && nums[j] > key)
	{
		nums[j+1] = nums[j];
		j--;
	}
	nums[j+1] = key;
}

for (int i = 0; i<length; i++)
{
	printf("%d ", nums[i]);
}
}