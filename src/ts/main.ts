enum PieceType {
  Pawn,
  Bishop,
  Knight,
  Rook,
  Queen,
  King
}
enum PieceColor {
  Black,
  White
}
enum SquareColor {
  Light,
  Dark
}

class Piece {
  type: PieceType;
  color: PieceColor;
}

class Square {
  color: SquareColor;
  piece: Piece;
}

class Board {
  blackPieces: Piece[];
  whitePieces: Piece[];
  squares: Square[];

  constructor() {
    this.blackPieces = new Piece[16];
    this.whitePieces = new Piece[16];

    for (let piece of this.blackPieces) piece.color = PieceColor.Black;
    for (let piece of this.whitePieces) piece.color = PieceColor.White;

    // The first eight pieces of either color are the pawns
    for (let i = 0; i < 8; ++i) {
      this.blackPieces[i].type = PieceType.Pawn;
      this.whitePieces[i].type = PieceType.Pawn;
    }

    // Setup remaining pieces
    this.blackPieces[8].type = PieceType.Bishop;
    this.blackPieces[9].type = PieceType.Bishop;
    this.whitePieces[8].type = PieceType.Bishop;
    this.whitePieces[9].type = PieceType.Bishop;

    this.blackPieces[10].type = PieceType.Knight;
    this.blackPieces[11].type = PieceType.Knight;
    this.whitePieces[10].type = PieceType.Knight;
    this.whitePieces[11].type = PieceType.Knight;

    this.blackPieces[12].type = PieceType.Rook;
    this.blackPieces[13].type = PieceType.Rook;
    this.whitePieces[12].type = PieceType.Rook;
    this.whitePieces[13].type = PieceType.Rook;

    this.blackPieces[14].type = PieceType.Queen;
    this.blackPieces[14].type = PieceType.Queen;

    this.whitePieces[15].type = PieceType.King;
    this.whitePieces[15].type = PieceType.King;
  }
}

const board = new Board();