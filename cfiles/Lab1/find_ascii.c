#include <stdio.h>

int main() {
char c;
printf("Enter a character: ");

scanf("%c", &c);
// %d will display the integer value (ASCII value)
// %c displays the actual character
printf("ASCII value of %c is %d", c, c);

return 0;
}