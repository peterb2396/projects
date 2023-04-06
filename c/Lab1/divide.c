#include <stdio.h>
int main() {
	int dividend, divisor, quotient, remaindr;
	printf("Enter dividend: ");
	scanf("%d", &dividend);
	
	printf("Enter divisor: ");
	scanf("%d", &divisor);
	//Compute quotient
	quotient = dividend / divisor;
	//Compute remainder
	remaindr = dividend % divisor;
	
	printf("Quotient = %d\n", quotient);
	printf("Remainder = %d", remaindr);
	return 0;
}
	