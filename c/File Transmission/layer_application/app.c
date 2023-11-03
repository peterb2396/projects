#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <errno.h>
#include <sys/wait.h>
#include <dirent.h>
#include <sys/stat.h>
#include <ftw.h>
#include <math.h>
#include <fcntl.h>

#define _XOPEN_SOURCE 500
#define NEW_FILE_NAME 28
#define FRAME_LEN 64

void producer(int ptoc_pipe[2], int ctop_pipe[2], const char* folder_path);
void consumer(int ptoc_pipe[2], int ctop_pipe[2]);

// Will fork to seperate processes for Producer and Consumer
// Beforehand, creates one pipe each way to go between the two.
int main() {
    int ptoc_pipe[2]; //producer to consumer
    int ctop_pipe[2]; //consumer to producer
    
    // Pipe & catch errors
    if (pipe(ptoc_pipe) == -1 || pipe(ctop_pipe) == -1) {
        perror("pipe");
        exit(EXIT_FAILURE);
    }

    // Fork process
    pid_t child_pid = fork();

    if (child_pid == -1) {
        perror("fork");
        exit(EXIT_FAILURE);
    }

    if (child_pid == 0) {
        // Child process (consumer)
        close(ptoc_pipe[1]); // Close the write end of the producer -> consumer pipe
        close(ctop_pipe[0]); // Close the read  end of the consumer -> producer pipe
        consumer(ptoc_pipe, ctop_pipe);
        close(ptoc_pipe[0]); // Close the read  end of the producer -> consumer pipe
        close(ctop_pipe[1]); // Close the write end of the consumer -> producer pipe
    } else {
        // Parent process (producer)
        close(ptoc_pipe[0]); // Close the read  end of the producer -> consumer pipe
        close(ctop_pipe[1]); // Close the write end of the consumer -> producer pipe
        const char* folder_path = "../input"; 
        producer(ptoc_pipe, ctop_pipe, folder_path);
        close(ptoc_pipe[1]); // Close the write end of the producer -> consumer pipe
        close(ctop_pipe[0]); // Close the read  end of the consumer -> producer pipe

        // Wait for the child process to complete
        waitpid(child_pid, NULL, 0);
    }

    return 0;
}

// Producer is responsible for reading and preparing input,
// sending it to consumer which will modify it
void producer(int ptoc_pipe[2], int ctop_pipe[2], const char* folder_path) {
    DIR* dir;
    struct dirent* ent;
    FILE *doneFile;
    FILE *binfFile;
    FILE *frmeFile;

    // For each file in the input directory...
    if ((dir = opendir(folder_path)) != NULL) {
        while ((ent = readdir(dir)) != NULL) {
            if (strcmp(ent->d_name, ".") != 0 && strcmp(ent->d_name, "..") != 0) {
                char input_file_path[256];
                snprintf(input_file_path, sizeof(input_file_path), "%s/%s", folder_path, ent->d_name);
                FILE* input_file = fopen(input_file_path, "r");

                if (input_file != NULL) {
                    
                    // Prepare a buffer to read a chunk of data from the input
                    char buffer[FRAME_LEN + 1];
                    int num_read;

                    // Store the file name without extension for naming future files
                    char *inpf = strndup(ent->d_name, strchr(ent->d_name, '.') - ent->d_name);

                    // Make a directory for these output files
                    char dirname[256]; 
                    snprintf(dirname, sizeof(dirname), "../output/%s", inpf);
                    if (mkdir(dirname, 0700))
                    {
                        // File already existed: Empty it
                        DIR *dir = opendir(dirname);
                        struct dirent *entry;

                        while ((entry = readdir(dir)) != NULL) {
                                char filePath[256];
                                snprintf(filePath, sizeof(filePath), "%s/%s", dirname, entry->d_name);
                                unlink(filePath);
                        }
                        closedir(dir);
                    }

                    

                    // Notify consumer to create chage their file reference / make the new files
                    sprintf(buffer, "%c%s", NEW_FILE_NAME, inpf);
                    write(ptoc_pipe[1], buffer, sizeof(buffer));

                    // prepare file.binf
                    char binf_file_name[50]; 
                    snprintf(binf_file_name, sizeof(binf_file_name), "../output/%s/%s.binf", inpf, inpf);
                    binfFile = fopen(binf_file_name, "w");

                    if (binfFile == NULL) {
                        perror("Error opening binf file");
                        fclose(input_file); // close the input fd to avoid mem leaks
                        return;
                    }

                    // prepare file.frme
                    char frme_file_name[50]; 
                    snprintf(frme_file_name, sizeof(frme_file_name), "../output/%s/%s.frme", inpf, inpf);
                    frmeFile = fopen(frme_file_name, "w");

                    if (frmeFile == NULL) {
                        perror("Error opening frme file");
                        fclose(input_file); // close the input fd to avoid mem leaks
                        return;
                    }

                    // prepare file.done
                    char done_file_name[50]; 
                    snprintf(done_file_name, sizeof(done_file_name), "../output/%s/%s.done", inpf, inpf);
                    doneFile = fopen(done_file_name, "w");

                    if (doneFile == NULL) {
                        perror("Error opening done file");
                        fclose(input_file); // close the input fd to avoid mem leaks
                        return;
                    }


                        // *** ALL FILES ARE NOW CREATED AND REFERENCED ***
                    
                    // Determine which frame to cause error within
                    // This is to simulate a transmission error as described in README
                    FILE *file_len;

                    file_len = fopen(input_file_path, "rb");

                    if (file_len == NULL) {
                        perror("Error opening input file to count length");
                        return;
                    }

                    // Seek to the end of the file
                    fseek(file_len, 0, SEEK_END);

                    // current position is number of characters
                    double length = ftell(file_len);
                    fclose(file_len);

                    // frames is chars / frame length
                    int frames = ceil(length / FRAME_LEN);

                    //  Get a random frame
                    unsigned int seed = (unsigned int)getpid();
                    srand(seed);

                    // between 0 and frames - 1
                    int random_frame = rand() % frames;
                    printf("Malformed frame: %d\n", random_frame + 1);


                    int frame_index = 0;
                    // Read the input in chunks of FRAME_LEN, pipe & fork to frame.
                    while ((num_read = fread(buffer, 1, FRAME_LEN, input_file)) > 0) {
                        
                        
                    
                        // Create a pipe to communicate with frame.c
                        int frame_pipe[2];
                        if (pipe(frame_pipe) == -1) {
                            
                            perror("pipe");
                            exit(EXIT_FAILURE);
                        }
;
                        
                        fflush(stdout);
                        pid_t frame_pid = fork();
                        
                        if (frame_pid == -1) {
                            printf("Fork error");
                            perror("fork");
                            
                            exit(EXIT_FAILURE);
                        }

                        


                        if (frame_pid == 0) {
                            

                            char frame_read[10]; // Buffer for converting arg1 to a string
                            char frame_write[10]; // Buffer for converting arg2 to a string

                            // Convert FD integers to strings
                            // so they can be passed as args

                            snprintf(frame_read, sizeof(frame_read), "%d", frame_pipe[0]);
                            snprintf(frame_write, sizeof(frame_write), "%d", frame_pipe[1]);
                            
                            
                            // Child process (frame.c)
                            
                            execl("../layer_data-link/frameService", "frameService", frame_read, frame_write, NULL);  // Execute frame.c
                            perror("execl");  // If execl fails
                            exit(EXIT_FAILURE);
                        } else {
                            // Parent process
                            
                            // Write data to be framed to frame.c through the frame pipe
                            write(frame_pipe[1], buffer, num_read);
                            //works
                            
                            
                            close(frame_pipe[1]);  // Close the write end of the frame pipe

                            // When child is done, read
                            waitpid(frame_pid, NULL, 0);
                            
                            
                            // Parent reads result from the child process (the new frame)
                            char frame[68]; // The frame to be recieved will be stored here

                            // Read frame result
                            int frame_len = read(frame_pipe[0], frame, sizeof(frame));
                            close(frame_pipe[0]);  // Close the read end of the frame pipe


                            // Null-terminate
                            if (frame_len > 0) {
                                if (frame_len < sizeof(frame)) {
                                    frame[frame_len] = '\0';
                                } else {
                                    frame[sizeof(frame) - 1] = '\0';
                                }
                            }
                            
                            // At this point, we have recieved the frame and can encode it.

                            // Write frame to .frme for debug
                            fwrite(frame, sizeof(char), frame_len, frmeFile);

                            // Pipe before forking to share a pipe for 
                            // transmission of encoding data
                            int encode_pipe[2];
                            if (pipe(encode_pipe) == -1) {
                                perror("pipe");
                                exit(EXIT_FAILURE);
                            }

                            
                            // Attempt to fork so child can exec the subroutine
                            fflush(stdout);
                            pid_t encode_pid = fork();
                            if (encode_pid == -1) {
                                perror("fork");
                                exit(EXIT_FAILURE);
                            }
                            
                            // Encode this single frame
                            if (encode_pid == 0)
                            {
                                
                                
                                // Make string versions of the pipe id's to pass to argv
                                char encode_read[10]; // Buffer for converting arg1 to a string
                                char encode_write[10]; // Buffer for converting arg2 to a string

                                // Convert integers to strings
                                snprintf(encode_read, sizeof(encode_read), "%d", encode_pipe[0]);
                                snprintf(encode_write, sizeof(encode_write), "%d", encode_pipe[1]);
                                
                                // Child process: Call encode then die
                                execl("../layer_physical/encodeService", "encodeService", encode_read, encode_write, NULL);
                                perror("execl");  // If execl fails
                                exit(EXIT_FAILURE);
                            }
                            else
                            {
                                

                                // Write data to be encoded through encode pipe
                                write(encode_pipe[1], frame, frame_len);
                                close(encode_pipe[1]);  // Done writing frame to be encoded

                                
                                waitpid(encode_pid, NULL, 0);;
                                
                                

                                // Parent reads result from the child process (the encoded frame)
                                // Add space for control chars and bit conversion
                                char encoded_frame[(FRAME_LEN + 3) * 8]; // The encoded frame
                                    
                                // Listen for & store encoded frame
                                int encoded_len = read(encode_pipe[0], encoded_frame, sizeof(encoded_frame));
                                close(encode_pipe[0]);  // Done reading encode data

                                // Here, we have the encoded_frame!
                                

                                // Simulate transmission error here
                                // Determine if this frame should be malformed to simulate error
                                if (frame_index == random_frame)
                                {
                                    int malform_pipe[2];
                                    if (pipe(malform_pipe) == -1) {
                                        perror("pipe");
                                        exit(EXIT_FAILURE);
                                    }

                                    // Attempt to fork so child can exec the subroutine
                                    fflush(stdout);
                                    pid_t malform_pid = fork();
                                    if (malform_pid == -1) {
                                        perror("fork");
                                        exit(EXIT_FAILURE);
                                    }
                                    // service
                                    if (malform_pid == 0)
                                    {
                                        // Make string versions of the pipe id's to pass to argv
                                        char malform_read[10]; // Buffer for converting arg1 to a string
                                        char malform_write[10]; // Buffer for converting arg2 to a string

                                        // Convert integers to strings
                                        snprintf(malform_read, sizeof(malform_read), "%d", malform_pipe[0]);
                                        snprintf(malform_write, sizeof(malform_write), "%d", malform_pipe[1]);
                                        
                                        // Child process: Call service then die
                                        execl("../layer_physical/malformService", "malformService", malform_read, malform_write, NULL);
                                        perror("execl");  // If execl fails
                                        exit(EXIT_FAILURE);
                                    }
                                    else //parent
                                    {
                                        // Write data to be serviced (the correct encoded frame) through service pipe
                                        write(malform_pipe[1], encoded_frame, sizeof(encoded_frame));
                                        close(malform_pipe[1]);  // Done writing frame to be serviced

                                        // When child is done, read result
                                        waitpid(malform_pid, NULL, 0);

                                        // Listen for & store malformed frame in previously alocated encoded_frame buff
                                        read(malform_pipe[0], encoded_frame, sizeof(encoded_frame));
                                        close(malform_pipe[0]);  // Done reading service data


                                    }
                                }
                               
                                // Write the encoded frame to the file, AND to the consumer to decode!

                                // May contain a flipped bit now.
                                fwrite(encoded_frame, sizeof(char), encoded_len, binfFile);
                                write(ptoc_pipe[1], encoded_frame, encoded_len);

                                // *** CONSUMER SENDS DATA THRU PIPE AND HERE WE WAIT ON IT AND
                                // *** CONTINUE PROCESSING TO CREATE THE .DONE FILE AS REQUESTED

                                char message[67 * 8]; // encoded stream (usually) from main pipe
                                memset(message, 0, sizeof(message));
                                ssize_t bytes_read = read(ctop_pipe[0], message, sizeof(message));
                            
                                // Pipe before forking to share a pipe for 
                                // transmission of data

                                int decode_pipe[2];
                                if (pipe(decode_pipe) == -1) {
                                    perror("pipe");
                                    exit(EXIT_FAILURE);
                                }
                                
                                // Attempt to fork so child can exec the subroutine
                                fflush(stdout);
                                pid_t decode_pid = fork();
                                if (decode_pid == -1) {
                                    perror("fork");
                                    exit(EXIT_FAILURE);
                                }
                                // Decode this single frame
                                if (decode_pid == 0)
                                {
                                    // Make string versions of the pipe id's to pass to argv
                                    char decode_read[10]; // Buffer for converting arg1 to a string
                                    char decode_write[10]; // Buffer for converting arg2 to a string

                                    // Convert integers to strings
                                    snprintf(decode_read, sizeof(decode_read), "%d", decode_pipe[0]);
                                    snprintf(decode_write, sizeof(decode_write), "%d", decode_pipe[1]);
                                    
                                    // Child process: Call encode then die
                                    execl("../layer_physical/decodeService", "decodeService", decode_read, decode_write, NULL);
                                    perror("execl");  // If execl fails
                                    exit(EXIT_FAILURE);
                                }
                                else // Parent
                                {
                                    // Write data to be decoded through decode pipe
                                    size_t bytes = write(decode_pipe[1], message, bytes_read);
                                    
                                    close(decode_pipe[1]);  // Done writing frame to be decoded

                                    // When child is done, read result
                                    waitpid(decode_pid, NULL, 0);;
                                    
                                    // Parent reads result from the child process (the decoded frame)
                                    char decoded_frame[FRAME_LEN + 3]; // The decoded frame is 1/8 the size
                                     
                                    // Listen for & store decoded frame
                                    int decoded_len = read(decode_pipe[0], decoded_frame, sizeof(decoded_frame));
                                    close(decode_pipe[0]);  // Done reading encode data
                                    
                                    // Here, we have the decoded frame!

                                    // Now, it's time to deframe it back to a chunk.

                                    // Create a pipe to communicate with deframe.c
                                    int deframe_pipe[2];
                                    if (pipe(deframe_pipe) == -1) {
                                        perror("pipe");
                                        exit(EXIT_FAILURE);
                                    }
                                    fflush(stdout);
                                    pid_t deframe_pid = fork();

                                    if (deframe_pid == -1) {
                                        perror("fork");
                                        exit(EXIT_FAILURE);
                                    }

                                    if (deframe_pid == 0) {
                                        char deframe_read[10]; // Buffer for converting arg1 to a string
                                        char deframe_write[10]; // Buffer for converting arg2 to a string

                                        // Convert integers to strings
                                        snprintf(deframe_read, sizeof(deframe_read), "%d", deframe_pipe[0]);
                                        snprintf(deframe_write, sizeof(deframe_write), "%d", deframe_pipe[1]);
                                        
                                        // Child process (deframe.c)
                                        execl("../layer_data-link/deframeService", "deframeService", deframe_read, deframe_write, NULL);  // Execute deframe.c
                                        perror("execl");  // If execl fails
                                        exit(EXIT_FAILURE);
                                    } else {
                                        // Parent process
                                        // Write data to be framed to deframe.c through the deframe pipe
                                        write(deframe_pipe[1], decoded_frame, decoded_len);
                                        close(deframe_pipe[1]);

                                        // When child is done, read chunk (ctrl chars removed)
                                        waitpid(deframe_pid, NULL, 0);;
                                        char chunk[FRAME_LEN + 1]; // The frame to be recieved will be stored here

                                        int chunk_len = read(deframe_pipe[0], chunk, sizeof(chunk));
                                        close(deframe_pipe[0]); 
                                        

                                        // Null-terminate
                                        if (chunk_len > 0) {
                                            if (chunk_len < sizeof(chunk)) { //FRAME_LEN < 65
                                                chunk[chunk_len] = '\0';
                                            } else {
                                                printf("WARNING! chunk size too small, overwrote last char. len: %d\n", chunk_len);
                                                chunk[sizeof(chunk) - 1] = '\0';
                                            }
                                        }


                                        fwrite(chunk, 1, chunk_len, doneFile);
                                    }
                                        
                                    
                                }// end section write-back to consumer
                                
                                
                            }

                        }
                        // increase frame index
                        frame_index++;
                    }

                    fclose(input_file);
                } else {
                    perror("fopen");
                }
            }
        }
        closedir(dir);
    } else {
        perror("opendir");
    }

    // Signal the end of processing to the consumer
    close(ptoc_pipe[1]);
    close(ctop_pipe[0]);
}

// Responsible for recieving data and modifying it, then sending back
void consumer(int ptoc_pipe[2], int ctop_pipe[2]) {
    
    // Define file pointers
    FILE* outfFile;
    FILE* chckFile;

    char message[67 * 8]; // encoded stream (usually) from main pipe
    char *inpf;           // name of input file currently being processed

    while (1) {
        ssize_t bytes_read = read(ptoc_pipe[0], message, sizeof(message));

        if (bytes_read <= 0) {
            break; // End of processing
        }

        // Check if we recieved special signal to change the target file
        // Must signal this for each input file that we begin to process
        if ((int)message[0] == NEW_FILE_NAME)
        {
            // New file name is a pointer to the string beginning after the control char
            inpf = &message[1]; 
            
            // Create the new consumer files

            // prepare the outf file in the "output" folder
            char outf_file_name[256]; 
            snprintf(outf_file_name, sizeof(outf_file_name), "../output/%s/%s.outf", inpf, inpf);
            outfFile = fopen(outf_file_name, "w");


            if (outfFile == NULL) {
                perror("fopen");
                return;
            }

            // prepare file.chck
            char chck_file_name[50]; 
            snprintf(chck_file_name, sizeof(chck_file_name), "../output/%s/%s.chck", inpf, inpf);
            chckFile = fopen(chck_file_name, "w");

            if (chckFile == NULL) {
                perror("Error opening binf file");
                return;
            }

        }
        else // we are reading data
        {
                    // *** .outf PROCESS ***

                // DECODE

            // Pipe before forking to share a pipe for 
            // transmission of data
            int decode_pipe[2];
            if (pipe(decode_pipe) == -1) {
                perror("pipe");
                exit(EXIT_FAILURE);
            }
            
            // Attempt to fork so child can exec the subroutine
            fflush(stdout);
            pid_t decode_pid = fork();
            if (decode_pid == -1) {
                perror("fork");
                exit(EXIT_FAILURE);
            }
            // Decode this single frame
            if (decode_pid == 0)
            {
                // Make string versions of the pipe id's to pass to argv
                char decode_read[10]; // Buffer for converting arg1 to a string
                char decode_write[10]; // Buffer for converting arg2 to a string

                // Convert integers to strings
                snprintf(decode_read, sizeof(decode_read), "%d", decode_pipe[0]);
                snprintf(decode_write, sizeof(decode_write), "%d", decode_pipe[1]);
                
                // Child process: Call encode then die
                execl("../layer_physical/decodeService", "decodeService", decode_read, decode_write, NULL);
                perror("execl");  // If execl fails
                exit(EXIT_FAILURE);
            }
            else // Parent
            {
                // Write data to be decoded through decode pipe
                write(decode_pipe[1], message, bytes_read);
                close(decode_pipe[1]);  // Done writing frame to be decoded

                // When child is done, read result
                waitpid(decode_pid, NULL, 0);;

                // Parent reads result from the child process (the decoded frame)
                char decoded_frame[67]; // The decoded frame is 1/8 the size
                    // NOTE 67 (frame len) * 9 with spaces, *8 without, is perfect amount

                // Listen for & store decoded frame
                int decoded_len = read(decode_pipe[0], decoded_frame, sizeof(decoded_frame));
                close(decode_pipe[0]);  // Done reading encode data

                // Here, we have the decoded frame!

                // Now, it's time to deframe it back to a chunk.

                // Create a pipe to communicate with deframe.c
                int deframe_pipe[2];
                if (pipe(deframe_pipe) == -1) {
                    perror("pipe");
                    exit(EXIT_FAILURE);
                }
                fflush(stdout);
                pid_t deframe_pid = fork();

                if (deframe_pid == -1) {
                    perror("fork");
                    exit(EXIT_FAILURE);
                }

                if (deframe_pid == 0) {
                    char deframe_read[10]; // Buffer for converting arg1 to a string
                    char deframe_write[10]; // Buffer for converting arg2 to a string

                    // Convert integers to strings
                    snprintf(deframe_read, sizeof(deframe_read), "%d", deframe_pipe[0]);
                    snprintf(deframe_write, sizeof(deframe_write), "%d", deframe_pipe[1]);
                    
                    // Child process (deframe.c)
                    execl("../layer_data-link/deframeService", "deframeService", deframe_read, deframe_write, NULL);  // Execute deframe.c
                    perror("execl");  // If execl fails
                    exit(EXIT_FAILURE);
                } else {
                    // Parent process
                    // Write data to be framed to deframe.c through the deframe pipe
                    write(deframe_pipe[1], decoded_frame, decoded_len);
                    close(deframe_pipe[1]);

                    // When child is done, read chunk (ctrl chars removed)
                    waitpid(deframe_pid, NULL, 0);;
                    char chunk[70]; // The frame to be recieved will be stored here

                    int chunk_len = read(deframe_pipe[0], chunk, sizeof(chunk));
                    close(deframe_pipe[0]); 
                    

                    // Null-terminate
                    if (chunk_len > 0) {
                        if (chunk_len < sizeof(chunk)) { //FRAME_LEN < 65
                            chunk[chunk_len] = '\0';
                        } else {
                            printf("WARNING! chunk size too small, overwrote last char. len: %d\n", chunk_len);
                            chunk[sizeof(chunk) - 1] = '\0';
                        }
                    }


                    // Create a pipe to communicate with capitalize.c
                    int uppercase_pipe[2];
                    if (pipe(uppercase_pipe) == -1) {
                        perror("pipe");
                        exit(EXIT_FAILURE);
                    }
                    fflush(stdout);
                    pid_t uppercase_pid = fork();

                    if (uppercase_pid == -1) {
                        perror("fork");
                        exit(EXIT_FAILURE);
                    }

                    if (uppercase_pid == 0) {

                        char uppercase_read[10]; // Buffer for converting arg1 to a string
                        char uppercase_write[10]; // Buffer for converting arg2 to a string

                        // Convert integers to strings
                        snprintf(uppercase_read, sizeof(uppercase_read), "%d", uppercase_pipe[0]);
                        snprintf(uppercase_write, sizeof(uppercase_write), "%d", uppercase_pipe[1]);
                        
                        // Child process (uppercase.c)
                        execl("../layer_physical/uppercaseService", "uppercaseService", uppercase_read, uppercase_write, NULL);  // Execute deframe.c
                        perror("execl");  // If execl fails
                        exit(EXIT_FAILURE);
                    } else {
                        // Parent process
                        // Write chunk to be capped to uppercase.c through the uppercase pipe
                        write(uppercase_pipe[1], chunk, chunk_len);
                        close(uppercase_pipe[1]); 

                        // When child is done, read chunk (capitalized)
                        waitpid(uppercase_pid, NULL, 0);
                        char cap_chunk[FRAME_LEN + 2]; // The capital chunk
                        int cap_chunk_len = read(uppercase_pipe[0], cap_chunk, sizeof(cap_chunk));
                        close(uppercase_pipe[0]); 
                        

                        // Penultimately, write to .outf
                        
                        fwrite(cap_chunk, 1, cap_chunk_len, outfFile);


                        // *** .chck PROCESS ***

                        // First, frame the data chunk again
                        
                        
                        // Create a pipe to communicate with frame.c
                        int frame_pipe[2];
                        if (pipe(frame_pipe) == -1) {
                            perror("pipe");
                            exit(EXIT_FAILURE);
                        }
                        fflush(stdout);
                        pid_t frame_pid = fork();

                        if (frame_pid == -1) {
                            perror("fork");
                            exit(EXIT_FAILURE);
                        }

                        if (frame_pid == 0) {

                            char frame_read[10]; // Buffer for converting arg1 to a string
                            char frame_write[10]; // Buffer for converting arg2 to a string

                            // Convert integers to strings
                            snprintf(frame_read, sizeof(frame_read), "%d", frame_pipe[0]);
                            snprintf(frame_write, sizeof(frame_write), "%d", frame_pipe[1]);
                            
                            // Child process (frame.c)
                            execl("../layer_data-link/frameService", "frameService", frame_read, frame_write, NULL);  // Execute frame.c
                            perror("execl");  // If execl fails
                            exit(EXIT_FAILURE);
                        } else {
                            // Parent process
                            // Write data to be framed to frame.c through the frame pipe
                            write(frame_pipe[1], cap_chunk, cap_chunk_len);
                            close(frame_pipe[1]);  // Close the write end of the frame pipe

                            // When child is done, read
                            waitpid(frame_pid, NULL, 0);
                            // Parent reads result from the child process (the new frame)
                            char frame[68]; // The frame to be recieved will be stored here

                            // Listen for frame result
                            int frame_len = read(frame_pipe[0], frame, sizeof(frame));
                            close(frame_pipe[0]);  // Close the read end of the frame pipe

                            // Null-terminate
                            if (frame_len > 0) {
                                if (frame_len < sizeof(frame)) {
                                    frame[frame_len] = '\0';
                                } else {
                                    frame[sizeof(frame) - 1] = '\0';
                                }
                            }
                            // At this point, we have recieved the frame and can encode it.
                            // Pipe before forking to share a pipe for 
                            // transmission of encoding data
                            int encode_pipe[2];
                            if (pipe(encode_pipe) == -1) {
                                perror("pipe");
                                exit(EXIT_FAILURE);
                            }
                            
                            // Attempt to fork so child can exec the subroutine
                            fflush(stdout);
                            pid_t encode_pid = fork();
                            if (encode_pid == -1) {
                                perror("fork");
                                exit(EXIT_FAILURE);
                            }
                            // Encode this single frame
                            if (encode_pid == 0)
                            {
                                // Make string versions of the pipe id's to pass to argv
                                char encode_read[10]; // Buffer for converting arg1 to a string
                                char encode_write[10]; // Buffer for converting arg2 to a string

                                // Convert integers to strings
                                snprintf(encode_read, sizeof(encode_read), "%d", encode_pipe[0]);
                                snprintf(encode_write, sizeof(encode_write), "%d", encode_pipe[1]);
                                
                                // Child process: Call encode then die
                                execl("../layer_physical/encodeService", "encodeService", encode_read, encode_write, NULL);
                                perror("execl");  // If execl fails
                                exit(EXIT_FAILURE);
                            }
                            else
                            {
                                // Write data to be encoded through encode pipe
                                write(encode_pipe[1], frame, frame_len);
                                close(encode_pipe[1]);  // Done writing frame to be encoded

                                // When child is done, read result
                                waitpid(encode_pid, NULL, 0);

                                // Parent reads result from the child process (the encoded frame)
                                char encoded_frame[(FRAME_LEN + 3) * 8]; // The encoded frame
                             
                                // Listen for & store encoded frame
                                int encoded_len = read(encode_pipe[0], encoded_frame, sizeof(encoded_frame));
                                close(encode_pipe[0]);  // Done reading encode data

                                // Here, we have the encoded_frame!

                               
                                // Write the encoded frame to the file, AND to the producer to decode!

                                fwrite(encoded_frame, sizeof(char), encoded_len, chckFile);
                                write(ctop_pipe[1], encoded_frame, encoded_len);

                                
                            }
                            
                        }
                    
                    }
                
            }

            
        }
        

        
    }
    
    }
    // Finally, close the last opened files
    fclose(outfFile);
    fclose(chckFile);
}
