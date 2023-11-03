#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>

int main() {
    pid_t child_pid;

    child_pid = fork();

    if (child_pid == -1) {
        perror("fork");
        return 1;
    }

    if (child_pid == 0) {
        // This code is executed by the child process.
        printf("Child process: My PID is %d. My parent's PID is %d.\n", getpid(), getppid());
    } else {
        // This code is executed by the parent process.
        printf("Parent process: My PID is %d. My child's PID is %d.\n", getpid(), child_pid);
    }

    return 0;
}
