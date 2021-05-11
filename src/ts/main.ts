enum PieceType {
  Pawn,
  Bishop,
  Knight,
  Rook,
  Queen,
  King,
  None
}
enum PieceColor {
  Black,
  White
}

class Piece {
  type: PieceType;
  color: PieceColor;

  constructor(type: PieceType = PieceType.None) {
    this.type = type;
  }

  fromFEN(fen: string) {
    // Check if corresponds to White or Black piece
    if (fen == fen.toUpperCase()) {  // White Piece
      this.color = PieceColor.White;
    } else {  // Black Piece
      this.color = PieceColor.Black;
    }

    fen = fen.toLowerCase();

    switch (fen) {
      case 'p':
        this.type = PieceType.Pawn;
        break;
      case 'b':
        this.type = PieceType.Bishop;
        break;
      case 'n':
        this.type = PieceType.Knight;
        break;
      case 'r':
        this.type = PieceType.Rook;
        break;
      case 'q':
        this.type = PieceType.Queen;
        break;
      case 'k':
        this.type = PieceType.King;
        break;
    }
  }

  toFEN(): String {
    let FEN: String = '';
    switch (this.type) {
      case PieceType.Pawn:
        FEN = 'p';
        break;
      case PieceType.Bishop:
        FEN = 'b';
        break;
      case PieceType.Knight:
        FEN = 'n';
        break;
      case PieceType.Rook:
        FEN = 'r';
        break;
      case PieceType.Queen:
        FEN = 'q';
        break;
      case PieceType.King:
        FEN = 'k';
        break;
    }

    if (this.color === PieceColor.White) FEN = FEN.toUpperCase();

    return FEN;
  }
}

class Board {
  pieces: Array<Array<Piece>>;

  constructor(
      fen:
          string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') {
    this.pieces = new Array<Array<Piece>>(8);
    for (let row = 0; row < 8; ++row) {
      this.pieces[row] = new Array<Piece>(8);
      for (let col = 0; col < 8; ++col) {
        this.pieces[row][col] = new Piece();
      }
    }

    this.importFEN(fen);
  }

  updatePiece(oldRow: number, oldCol: number, newRow: number, newCol: number):
      boolean {
    if (oldRow === newRow &&
        oldCol === newCol)  // nothing to do, piece was not moved
      return true;

    const oldPiece: Piece = this.pieces[oldRow][oldCol];
    this.pieces[oldRow][oldCol] = new Piece(PieceType.None);
    this.pieces[newRow][newCol] = oldPiece;

    return true;  // TODO: Check if move is even legal
  }

  // Sets the board up according to the given FEN
  importFEN(fen: string) {
    const fields: String[] = fen.split(' ');
    const ranks: String[] = fields[0].split('/');

    console.log('New FEN: ', fen);

    // reset pieces
    this.pieces = new Array<Array<Piece>>(8);
    for (let row = 0; row < 8; ++row) {
      this.pieces[row] = new Array<Piece>(8);
      for (let col = 0; col < 8; ++col) {
        this.pieces[row][col] = new Piece();
      }
    }

    for (let row = 0; row < 8; ++row) {
      let posInFEN = 0;
      for (let col = 0; col < 8; ++col) {
        let curr = ranks[row][posInFEN];
        posInFEN++;

        // A number means `n` empty squares
        if (curr >= '1' && curr <= '8') {
          const numEmptySquares = parseInt(curr);
          for (let i = 0; i < numEmptySquares; ++i)
            this.pieces[row][col++] = new Piece();
          col--;  // Correct for the last increment
        } else {
          this.pieces[row][col].fromFEN(curr);
        }
      }
    }

    // TODO: Process remainding fields of FEN
  }
}

function setupSquares(
    boardDiv, board: Board, lightColor: string, darkColor: string) {
  // Add squares to html
  let currFile = 'A';  // Used below to display the file inside the board
  let currRank = 8;
  for (let row = 0; row < 8; ++row) {
    for (let col = 0; col < 8; ++col) {
      let color = darkColor;
      if ((row + col) % 2 == 0) color = lightColor;

      let squareElement: HTMLSpanElement =
          document.createElement('span') as HTMLSpanElement;
      squareElement.dataset.row = row.toString();
      squareElement.dataset.col = col.toString();
      squareElement.style.background = color;
      squareElement.classList.add('square');
      const imgElement = document.createElement('IMG');
      squareElement.appendChild(imgElement);

      // Add file names on first rank
      if (row == 7) {
        const fileLabel = document.createElement('span');
        fileLabel.innerHTML = currFile;
        fileLabel.classList.add('fileLabel');
        squareElement.appendChild(fileLabel);

        currFile = String.fromCharCode(currFile.charCodeAt(0) + 1);
      }

      if (col == 7) {
        const rankLabel = document.createElement('span');
        rankLabel.innerHTML = currRank.toString();
        rankLabel.classList.add('rankLabel');
        squareElement.appendChild(rankLabel);

        currRank = currRank - 1;
      }

      boardDiv.appendChild(squareElement);
    }
  }
}

function updatePiecesOnBoard(boardDiv, board: Board, dragHandler: Function) {
  const htmlSquare = boardDiv.querySelectorAll('img');
  htmlSquare.forEach((image) => {image.src = '#'});
  for (let row = 0; row < 8; ++row) {
    for (let col = 0; col < 8; ++col) {
      const piece = board.pieces[row][col];
      if (piece.toFEN() !== '') {
        const imgElement = htmlSquare[8 * row + col];
        const imgSrc: string = 'img/' + piece.toFEN() + '.png';

        imgElement.ondragstart = () => {
          return false;
        };

        imgElement.onmousedown = (event: MouseEvent) => {
          dragHandler(board, row, col, imgElement.parentElement, event);
        };
        imgElement.src = imgSrc;
      }
    }
  }
}

function handleBoardClick(
    board: Board, startRow: number, startCol: number, parentSquare: HTMLElement,
    originalEvent: MouseEvent) {
  if (document.querySelector('.ghostPiece')) {
    return;  // if user is already dragging, don't do anything
  }
  // Create copy of piece that follows the mouse
  const originalPiece = parentSquare.querySelector('img');
  const ghostPiece = document.createElement('img');
  ghostPiece.classList.add('ghostPiece');
  ghostPiece.src = originalPiece.src;
  const ghostPieceSize = {
    // Ghost piece should be slightly larger than original piece
    width: originalPiece.getBoundingClientRect().width * 1.2,
    height: originalPiece.getBoundingClientRect().height * 1.2
  };
  ghostPiece.style.width = ghostPieceSize.width.toString() + 'px';
  ghostPiece.style.height = ghostPieceSize.height.toString() + 'px';

  parentSquare.classList.add('original');

  ghostPiece.ondragstart = () => {
    return false;
  };

  const htmlBoard = parentSquare.parentElement;
  htmlBoard.appendChild(ghostPiece);

  // helper function to set pieces positon
  const updatePositionofGhostPiece = (x: number, y: number) => {
    ghostPiece.style.left = (x - ghostPieceSize.width / 2).toString() + 'px';
    ghostPiece.style.top = (y - ghostPieceSize.height / 2).toString() + 'px';
  };

  const currentMouseX = originalEvent.clientX;
  const currentMouseY = originalEvent.clientY;

  updatePositionofGhostPiece(currentMouseX, currentMouseY);

  // The piece should follow the mouse
  htmlBoard.onmousemove = (event: MouseEvent) => {
    const newX = event.clientX;
    const newY = event.clientY;

    const dropPosition = {x: event.clientX, y: event.clientY};
    const targetSquare: any =
        document.elementsFromPoint(dropPosition.x, dropPosition.y)
            .find(element => {return element.classList.contains('square')});

    updatePositionofGhostPiece(newX, newY);
  };

  htmlBoard.onmouseup = (event) => {
    const dropPosition = {x: event.clientX, y: event.clientY};
    const targetSquare: any =
        document.elementsFromPoint(dropPosition.x, dropPosition.y)
            .find(element => {return element.classList.contains('square')});

    if (!targetSquare) {  // piece was dropped outside board
      ghostPiece.remove();
    } else {
      const newRow = targetSquare.dataset.row;
      const newCol = targetSquare.dataset.col;

      board.updatePiece(startRow, startCol, newRow, newCol);
      updatePiecesOnBoard(htmlBoard, board, handleBoardClick);

      parentSquare.classList.remove('original');
      htmlBoard.querySelector('.ghostPiece').remove();
    }

    htmlBoard.onmouseup = undefined;
  };
}


const DarkColor = '#2876AD';
const LightColor = '#7AB9E6';


const board: Board = new Board(
    'rnbqkb1r/pp2pppp/2p2n2/3p4/3PP3/2N2N2/PPP2PPP/R1BQKB1R b KQkq - 3 4');

const boardDiv = document.getElementsByClassName('board')[0];

setupSquares(boardDiv, board, LightColor, DarkColor);
updatePiecesOnBoard(boardDiv, board, handleBoardClick);