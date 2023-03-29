## Peter Buonaiuto
## ICSI 504
## MIPS Assembly Project - sort an array


.text

radixSort:

		# REGISTERS:
	# s3 = 10
	# s4, ra = main return address
	# s5 = max value
	# s6 = 'exp' = loop counter / argument for countSort
	# s7 = m / exp
	
	
	move $s4, $ra        # save the main return addr to avoid inf loop
	jal getMax               # grab the max value
	addi $s5, $v1, 0      # s5 is now max value
	
	move $ra, $s4         # restore return address back to main
	
	li $s6, 1                  # current array index (counter / exp) to 1
	
	radix_loop:
	div $s5, $s6           # divide m / exp do this each time to check cndn
	mflo $s7                 # s7 = m / exp
	
	ble $s7, $zero, radix_loop_end       # stop when m/exp <= 0
	
					# LOOP BODY
					
	move $a3, $s6        #setup argument exp, the rest a1, a2 are done
	move $s4, $ra        # save the main return addr to avoid inf loop
	jal countSort
	
	move $ra, $s4         # restore return address back to main
	
	############# END LOOP BODY
	
	
	mul $s6, $s6, $s3                # update exp (loop counter)*10
		
	j radix_loop                          # repeat the loop
	
	radix_loop_end:


	
jr $ra

countSort:
		# REGISTERS:
	#	a1 = Argument: array source
	#	a2 = Argument: array size
	#  a3 = exp
	#  s0 = 10 
	#  s1 = Count array
	#  s2 = Output array
	#	t0  = current array item address
	#	t1  = current array item index (counter, i)
	#  t2 = current array item value 
	#  t3 = arr[i] / exp
	#  t4 = arr[i] / exp % 10
	#  t5 = value at Count [ t4 ]
	

	
	 #### INITIALIZE COUNT ARRAY
	 la $s1, Count         # load Count array to s1
	 li $s0, 10                # size of Count array
	 move $t0, $a1       # first item in array = source address
	 li $t1, 0                  # current array index (counter) to 0
	
	loop1:
	beq $t1, $a2, loop1_end       # stop when index = size
	
					# LOOP BODY
	# make index  :     arr[i] / exp % 10
	
	lw $t2, ($t0)    #arr[i]
	div $t2, $a3    #arr[i] / exp
	mflo $t3
	
	div $t3, $s0
	mfhi $t4 
	
	add $t4, $t4, $t4     # multiply t4 (index) by 2
	add $t4, $t4, $t4     # multiply t4 (index) by 2
	
	add $t4, $t4, $s1    # t4 = address of Count [ t4 ]
	
	lw $t5, 0($t4)
	addi $t5, $t5, 1       # add one to the value 
	sw $t5, 0($t4)         # store increimented value back into location t4
	
	addi $t0, 4                 # add 4 to address (the next element)
	############# END LOOP BODY
	
	
	addi $t1, $t1, 1          # increment the loop counter
		
	j loop1                       # repeat the loop
	
	loop1_end:

		
	li $t1, 1                      # Reset loop counter to 1
	la $s1, Count            # reload Count array source to s1
	move $t0, $s1           # set current address to Count array source + 4
	
	loop2:
	beq $t1, $s0, loop2_end       # stop when index = 10
	
					#### LOOP 2 BODY ####
					
	addi $t0, 4            #set t0 to point to the next element (i)
	lw $t2, ($t0)          #t2 = count[i]; current value of Count
	addi $t0, -4           #t0 = address of [i - 1] element
	lw $t3, ($t0)          #t3 = count[i - 1]; current value of previous element
	
	add $t2, $t2, $t3   #t2 is now the sum of Count[i] + Count[i-1]
	addi $t0, 4            #t0 now points back to element [i]
	sw $t2, ($t0)         #Complete: Count[i] += Count[i - 1];

				#### END LOOP 2 BODY ####
				
	addi $t1, $t1, 1          # increment the loop counter
	j loop2                       # loop again
	
	loop2_end:
		
	                          # Setup Output Array
	move $t0, $a1           # set current address to input array source
	move $t1, $a2
	addi $t1, -1
	li $t2, 4
	
	mult $t1, $t2
	mflo $t1
	
	add $t0, $t0, $t1      #t0 becomes the address of the last item (n-1)

		
		
	la $s2, Output           # copy array s1 into s2 (output)
	
	addi $t1, $a2, -1	      # loop counter (i) starts at n-1
		
	loop3:
	blt $t1, $zero, loop3_end       # stop when index < 0
	
					#### LOOP 3 BODY ####
		lw $t2, ($t0)       # load arr[i] to memory cell t2
		div $t2, $a3       # arr[i] / exp
		mflo $t3
	
		div $t3, $s0        
		mfhi $t4   			  # arr[i] / exp % 10
		
		add $t4, $t4, $t4
		add $t4, $t4, $t4        #index * 4
		
		
		la $t5, Count           # store source address of count as t5

		add $t3, $t4, $t5       # address of count[arr[i] / exp % 10]
		lw $t4, ($t3)               # t4 is loaded value at that location, t3

		
		addi $t4, $t4, -1         # count[arr[i] / exp % 10] - 1 is an INDEX
		
		add $t4, $t4, $t4
		add $t4, $t4, $t4		  # multiply index by 4 to get bit offset
		
		add $t4, $t4, $s2
		sw $t2, ($t4)                #store arr[i], t2, in t4, which is output[...]
		
		
		############ Second line of code: 
		############ count[(arr[i] / exp) % 10]--;
		# make index  :     arr[i] / exp % 10 then find count here and --
	
		lw $t2, ($t0)    #arr[i]
		div $t2, $a3    #arr[i] / exp
		mflo $t3
	
		div $t3, $s0
		mfhi $t4 
	
		add $t4, $t4, $t4     # multiply t4 (index) by 2
		add $t4, $t4, $t4     # multiply t4 (index) by 2
	
		add $t4, $t4, $s1    # t4 = address of Count [ t4 ]
	
		lw $t5, 0($t4)
		addi $t5, $t5, -1       # subtract one to the value 
		sw $t5, 0($t4)         # store increimented value back into location t4
		
		
		addi $t0, $t0, -4          #Next arr[i]
				#### LOOP 3 END BODY ####
				
	addi $t1, -1          # decrement loop counter
	j loop3                 # loop again
	
	loop3_end:
		
		##########  FOURTH FOR LOOP FROM SPEC ####
		
	li $t1, 0
	move $t0, $s2       #initialize t0 to output source address
	move $t3, $a1       #initialize t3 to array source address
	loop4:
	beq $t1, $a2, loop4_end       # stop when i = n
	
	
					#### LOOP 4 BODY####

	lw $t2, ($t0)            # load the output[i] from memory into t2
	sw $t2, ($t3)             # store the output[i] into arr[i] location

	
	addi $t0, 4                 # add 4 to address (for the next element)
	addi $t3, 4                 # add 4 to address (the next address)
	
	############# END LOOP 4 BODY
	
	addi $t1, $t1, 1          # increment the loop counter
		
	j loop4                       # repeat the loop
	
	loop4_end:
 ################## END FOURTH SPEC LOOP #################
	jr $ra
	
	
	
getMax:
	# REGISTERS:
	#	a1 = Argument: array source
	#	a2 = Argument: array size
	#	t0  = current array item address
	#	t1  = current array item index (int)
	#  t2  = current max element address
	#  t3 = current element value (int)
	#  t4 = current max element value (int)
	#  v1 = Return: max value (int)
	
	move $t0, $a1    # first item in array = source address
	move $t2, $t0    # max initialized to first array element
	addi $t0, 4          # look at the second array item
	li $t1, 1              # current array index starts at 1 (0 is max, first)
	
	max_loop:
	beq $t1, $a2, max_loop_end       # stop when index = size
	
					# MAX LOOP BODY
	
	lw $t3, ($t0) #dereference $t0 to get current item VALUE (int)
	lw $t4, ($t2) #dereference $t2 to get current max VALUE (int)
	
	ble $t3, $t4, skip_update
	# STORE THE NEW MAX
		move $t2, $t0
		
	skip_update:

	addi $t1, $t1, 1          # increment the loop counter
	addi $t0, 4                 # add 4 to address (the next element)
	

	j max_loop                # repeat the loop
	
					# END MAX LOOP BODY
					
	max_loop_end:
	#lw $a0, ($t2)                # print max value
	#li $v0, 1
	#syscall
	
	lw $v1, ($t2)    # return max value
	jr $ra          #return to caller (main)
	
	
	
printData:
	# REGISTERS:
	#	a1 = Argument: array source
	#	a2 = Argument: array size
	#	t0  = current array item address
	#	t1  = current array item index
	
	move $t0, $a1    # first item in array = source address
	li $t1, 0               # current array index
	
	print_loop:
	beq $t1, $a2, print_loop_end       # stop when index = size
	
					# PRINT LOOP BODY
	
	lw $a0, ($t0)                # print next value
	li $v0, 1
	syscall
	
	la $a0, Newline           # print newline
	li $v0, 4
	syscall
	
	addi $t1, $t1, 1          # increment the loop counter
	addi $t0, 4                 # add 4 to address (the next element)
		
	j print_loop                # repeat the loop
	
					# END PRINT LOOP BODY
					
	print_loop_end:
	jr $ra          #return to caller (main)


main:
	la $a1, Array       # Setup array and size arguments for functions
	lw $a2, Size 

	jal radixSort        # Call functions
	jal printData
	
	li $v0,10              # exit program
	syscall
	
.data
	Size: .word 9
	Array: .word 7, 9, 4, 3, 8, 1, 6, 2, 5
	Newline: .asciiz "\n"
	
	# Allocate memory for arrays for sorting subroutines
	.align 2
	Count: .space 40
	.align 2
	Output: .space 36        # MUST BE 4 * Size