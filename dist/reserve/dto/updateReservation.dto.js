"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateReservationDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const createReservation_dto_1 = require("./createReservation.dto");
class UpdateReservationDto extends (0, mapped_types_1.PartialType)(createReservation_dto_1.CreateReservationDto) {
}
exports.UpdateReservationDto = UpdateReservationDto;
//# sourceMappingURL=updateReservation.dto.js.map