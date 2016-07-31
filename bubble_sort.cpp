#include "stdio.h"

void swap(int &a, int &b) {
  int temp = a;
  a = b;
  b = temp;
}

void bubblesort(int A[], int n) {
  for (bool sorted = false; sorted = !sorted; --n) {
    for (int i = 1; i < n; ++i) {
      if (A[i-1] > A[i]) {
        swap(A[i-1], A[i]);
        sorted = false;
      }
    }
  }
}

int main(int argc, char const* argv[]) {
  int A[] = {88, 11, 22, 0, 9};
  bubblesort(A, 5);

  for (int i = 0; i < 5; ++i) {
    printf("%d\n", A[i]);
  }

  return 0;
}
