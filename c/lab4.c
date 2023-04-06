#include <stdio.h>
#include <stdlib.h>
#include <time.h>

	//Define structure
	struct node 
	{
		int value;
		struct node *next;
	};
	
int main() {

	//Declare functions
	void print_list(struct node*);
	void insert_node(struct node**, struct node**, int);
	void delete_node (struct node**, int);
	struct node *last_occur (struct node*, int);
	
	//Variables
	struct node *head, *tail;
	head = tail = NULL;
	int value;
	
	//Random seed 
	time_t t;
	srand((unsigned) time(&t));
	
	//Main insertion loop
	do {
		value = rand() % 25;
		insert_node(&head, &tail, value);
	} while (value != 8);
	
	print_list(head);
	delete_node(&head, 8);
	print_list(head);
	struct node* last = last_occur(head, 5);
	printf("Address of last occurance of 5: %p", last);
}

struct node *last_occur (struct node *h, int x)
{
	struct node* temp = NULL;
		while (h != NULL)
		{
			if (h->value == x)
			{
				temp = h;
			}
			h = h->next;
		}
		return temp;
}

void delete_node (struct node **ph, int x)
{
    struct node *temp = *ph;
    struct node *prev;
 
    if (temp != NULL && temp->value == x) {
        *ph = temp->next; 
        //The head is to be deleted so replace it with what is next
        free(temp);
        return;
    }
 	
 	//Search
    while (temp != NULL && temp->value != x) {
        prev = temp;
        temp = temp->next;
    }
 
    //After traversing, check if we never found the item x
    if (temp == NULL)
        return;
 
    prev->next = temp->next;
 
    free(temp); // Free memory
}
void insert_node (struct node **h, struct node **t, int v)
{
	struct node *temp;
	
	//Assign temp an address to store a structure if enough room
	if ((temp = (struct node *)malloc(sizeof(struct node))) == NULL) {
		printf("Node allocation failed. \n");
		exit(1); /* Stop program */
	}
	
	//The new node now has a spot in memory, set it up.
	temp->value = v; 
	temp->next = NULL;
	
	if (*h == NULL) { //This is the first element to be added.
		*h = *t = temp;
	}
	else
	 { //The tail will now point to the new value, which then becoems the new tail
		*t = (*t)->next = temp; 
	}
}

void print_list(struct node *h)
{
	int count = 0;

		printf("Values in the list are:\n");
		while (h != NULL) {
			printf("%d\n", h->value);
			h = h->next;
			count++;
		}
		printf("There are %d values in the list.\n",count);
}