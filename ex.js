hold[1] = new Item("character", "Prof. Plum", 160, 32, 240, 18, 1);
    board[18][1].hold = 1;
    board[18][1].obstacle = true;
    
    hold[2] = new Item("character", "Miss Scarlet", 255, 36, 0, 1, 18);
    board[1][18].hold = 2;
    board[18][1].obstacle = true;
    
    hold[3] = new Item("character", "Mrs. Peacock", 0, 0, 255, 18, 18);
    board[18][18].hold = 3;
    board[18][18].obstacle = true;
    
    hold[4] = new Item("character", "Colonel Mustard", 204, 204, 0, 7, 7);
    board[7][7].hold = 4;
    board[7][7].obstacle = true;