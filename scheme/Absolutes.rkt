#lang scheme
;Absolutes
;Peter Buonaiuto
;December 1, 2021

; Return a list where each element is the absolute value of the corresponding element in the original list.
(define (abs-each nums)
  (if (null? nums) ; null? checks if we have a list with valid elements.
      '()  ; Return an empty list if we were not given any numbers.
      (cons (abs(car nums)) (abs-each (cdr nums))))) ; Append the absolute of the current value to the list of absolutes of the rest.
                                                     ; cons will construct a list with the following two values.
                                                     ; abs takes the absolute value, car is the first item in the list,
                                                     ; cdr is the tail of the list.

; Test Cases
(abs-each '(-1.1 -2 3))
(abs-each '(4.3 43))
(abs-each '())
(abs-each '(-18.5))
(abs-each '(1 -2 3 -4 5 -6))
(abs-each '( -78 -20))
(abs-each '( -4))
(abs-each '( -3 -2.4 -2 -32 0))
(abs-each '(0 1 2 -3))
(abs-each '(65 -82.91 -18 -9))