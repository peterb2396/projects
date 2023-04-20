import cv2
import numpy as np
import pytesseract

debug = True

def crop(path):
    # Load the image
    img = cv2.imread(path)

    # Define the size of the output image
    width = 1190# width of the output image
    height = 1684 # height of the output image

    if debug:
        cv2.imshow('Original Image', img)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

    # Convert the image to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    if debug:
        cv2.imshow('Grayscale Image', gray)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

    # Apply adaptive thresholding to convert the image to a binary image
    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 71, 25)

    if debug:
        cv2.imshow('Binary threshold Image', thresh)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

    # Find contours in the binary image
    contours, hierarchy = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Initialize the maximum area and corresponding contour
    max_area = 0
    max_cnt = None

    # Loop through each contour
    for cnt in contours:
        # Calculate the area of the contour
        area = cv2.contourArea(cnt)

        # If the area is small, ignore the contour
        if area < 100:
            continue

        # Check if the contour is closed
        perimeter = cv2.arcLength(cnt, True)
        approx = cv2.approxPolyDP(cnt, 0.04 * perimeter, True)
        if len(approx) != 4:
            continue

        # Check if the area of the contour is the maximum so far
        if area > max_area:
            max_area = area
            max_cnt = approx

    # Extend the corners of the contour to align them along the horizontal and vertical axes
    max_cnt[0][0][1] -= 1 # Top corner
    max_cnt[1][0][0] += .01 # Right corner
    max_cnt[2][0][1] += 1 # Bottom corner
    max_cnt[3][0][0] -= 1 # Left corner

    a = max_cnt[0][0]
    b = max_cnt[1][0]
    c = max_cnt[2][0]
    d = max_cnt[3][0]

    # Create a white mask of the same size as the input image
    mask = np.ones(img.shape[:2], dtype=np.uint8) * 255

    # Fill the mask with black inside the detected boundary
    cv2.drawContours(mask, [max_cnt], 0, 0, -1)

    # Copy the original image content inside the detected boundary onto the new image
    new_img = np.copy(img)
    new_img[np.where(mask==0)] = img[np.where(mask==0)]

    

    # Fill the area outside the detected boundary with white color
    new_img[np.where(mask==255)] = [255, 255, 255]

    if debug:
        cv2.imshow('Content in boundary', new_img)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

    '''Fix the warping of the image '''
    # Define the four points of the original image

    src = np.array([[b[0], b[1]], [a[0], a[1]],[d[0], d[1]],[c[0], c[1]]])
    dest = np.array([[0,0],[width,0],[width,height],[0,height]])

    # Calculate the transformation matrix
    M, _ = cv2.findHomography(src, dest)

    # Apply perspective correction to the image
    img_corrected = cv2.warpPerspective(new_img, M, (width,height))

    ''' Make sure the image is the right 90 degree orientation'''

    # Convert the image to grayscale
    gray = cv2.cvtColor(img_corrected, cv2.COLOR_BGR2GRAY)

    # Detect the orientation of the text using Tesseract
    orientation = pytesseract.image_to_osd(gray)

    # Extract the rotation angle from the orientation string
    angle = int(orientation.split('\n')[1].split(':')[-1])

    # Rotate the image to the correct orientation
    if angle > 250 and angle < 290:
        img_corrected = cv2.rotate(img_corrected, cv2.ROTATE_90_CLOCKWISE)
        img_corrected = cv2.resize(img_corrected, (width, height))
    elif angle > 160 and angle < 200:
        img_corrected = cv2.rotate(img_corrected, cv2.ROTATE_180)
    elif angle > 70 and angle < 110:
        img_corrected = cv2.rotate(img_corrected, cv2.ROTATE_90_COUNTERCLOCKWISE)
        img_corrected = cv2.resize(img_corrected, (width, height))


    ''' Show the results '''
    
    cv2.imshow('Corrected Image', img_corrected)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

crop('paper.jpg')
#crop('1.jpg')
#crop('2.png')
#crop('3.png')
crop('4.png')