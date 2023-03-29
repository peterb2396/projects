#lang scheme
;Bubble Sort
;Peter Buonaiuto
;December 1st, 2021


; Function to make one pass through a given list, sorting its elements
; by comparing two at a time and deciding if they should be swapped.
(define (bubble list)                     ;Will compare the first two items of the given list.
   (if (null? (cdr list))  
     list                                 ; Return the item if there's nothing to compare it to.
  (if (< (car list) (cadr list))          ; If the first item is listess than the second, 
(cons (car list) (bubble (cdr list)))     ; keep it and analyze the next two items.
(cons (cadr list) (bubble (cons (car list) (cddr list))))  
  ) 
  )); NOTE: cdr represents the tail of a list. car retrieves the first item of a list,
    ;       cadr returns the second item (car of the cdr) and cons will create a list
    ;       containing the two lists that follow in the expression.


; Controls how many times to call the bubble function for optimization.
; This function will continue to sort the list only until the list is
; completely sorted, instead of always making n^2 passes (worst case).
(define (bubble-sort list)           ; Recursively bubbles atoms of a list until they stop swapping
  (
   cond ((equal? list (bubble list)) ; Check if our list can be further sorted, by checking if the given list will be different
                                     ; than it's once - sorted version; using 'equal?' which equates the content of the object.
         (bubble list))              ; Sort if necessary.
        (
         else (bubble-sort (bubble list));Stop & return when no more swaps will occur.
        )
  )
)

;Test cases
(bubble-sort '(2 9 4 1 3 7))
(bubble-sort '(3 9 1))
(bubble-sort '(5))
(bubble-sort '(6 1 9 2 1 4 2))
(bubble-sort '(1 3))
(bubble-sort '(5 4 3 2 1 0))
(bubble-sort '(2 2 1 8))
(bubble-sort '(81 3 412))
(bubble-sort '(1 14 2 14 3 14 92 3))
(bubble-sort '(9 0 6))