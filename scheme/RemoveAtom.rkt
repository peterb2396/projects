#lang scheme
;Remove Atom
;Peter Buonaiuto
;December 1, 2021

; Remove an element x from the list, no matter how deep.
(define (remove x list)
(cond ((null? list)        ; cond checks the following boolean condition, and executes the next block if it is true.
    '())                   ; Return a blank list of the list has been emptied
((list? (car list))        ; car gets the first list element. list? checks if the list is has a proper format and is valid.
    (cons (remove x (car list)) (remove x (cdr list))))   ; Construct a list which visits each sublist and tries removal
         ; cons will create a new list containing elements being the next two given lists.
((equal? (car list) x)        ; This element is to be removed, so...      (equal? checks if the following two objects are equal)
    (remove x (cdr list))) ; Leave behind that element and continue checking the rest of the list for more to be deleted.
(else
(cons (car list) (remove x (cdr list)))))) ; This atom is not to be removed, so keep it and continue traversal
                       ;cdr will return the tail of the given list (not first element).

; Test Cases
(remove '1 '(5 4 (3 2 1) (2 1) 1))
(remove '1 '(0 1 2 3 (1 0) (1 1) (1 2)))
(remove '3 '(1 2 3 4 5 6))
(remove '18 '(18 2 (3 4 (5 (4 18)) 5) 6 (6 18 12)))
(remove '22 '(22))

(remove 'a '(b a n a n a))
(remove 'ben '(ben (jerry jill) (steve (jim ben) ben) (((peter ben)))))
(remove 'safe '(deep (nested (secret (is (safe (!)))))))
(remove 'tues '(mon tues weds))
(remove 'no '(I have no problems!))