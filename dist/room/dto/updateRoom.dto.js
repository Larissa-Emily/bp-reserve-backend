"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRoomDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const createRoom_dto_1 = require("./createRoom.dto");
class UpdateRoomDto extends (0, mapped_types_1.PartialType)(createRoom_dto_1.CreateRoomDto) {
}
exports.UpdateRoomDto = UpdateRoomDto;
//# sourceMappingURL=updateRoom.dto.js.map