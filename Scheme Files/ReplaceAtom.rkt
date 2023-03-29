#lang scheme
;Replace Atoms
;Peter Buonaiuto
;December 1, 2021

; Replaces all instances of x with y
(define (replace x y list)
(cond ((null? list)                                           ; cond will check the following condition; executes next block if true.
       '())                                                   ; Return an empty list if the parameter is empty.
((list? (car list))
    (cons (replace x y (car list)) (replace x y (cdr list)))); Ensure sublists are recusively visited.
  ;car gets first element, cons makes a list comprising the
  ;next two elements, cdr gets the tail, equal? compares objs.
((equal? (car list) x)                                        ; Should this atom be replaced?
    (cons y (replace x y (cdr list))))                        ; Replace the atom and check the cdr for remaining swaps.
(else
    (cons (car list) (replace x y (cdr list))))))             ; Otherwise, keep 1st atom the same and check the rest of the list.

;Test Cases
(replace 'a 'e '(b a n a n a))
(replace 'g 'b '(g a r y ((g e t s)) ((g)(u)(y)(s) )))
(replace 'e 'E '(d (e (e (p ( (n (e (s (t))))))))))
(replace 'b '4 '(a b c))
(replace '14 '18 '(14 (years old)))
(replace 'old 'young '(14 (years old)))
(replace '1 '4 '(5 4 (3 2 1) (2 1) 1))
(replace '2 '18 '((1 2) ((3 4) (3 2 1))))
(replace 'not 'now '(I have not been replaced!))
(replace '99 'no '(99 problems))