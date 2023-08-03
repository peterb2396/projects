#include <stdio.h>
int main(){    
	float firstNumber, secondNumber;    
	printf("Enter two floats: "); 
	scanf("%f %f", &firstNumber, &secondNumber); 
	float productOfTwoNumbers = firstNumber * secondNumber; 
	printf("%f * %f = %f", firstNumber, secondNumber, productOfTwoNumbers);  
	return 0; 
}
