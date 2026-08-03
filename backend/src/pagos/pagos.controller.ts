import { Controller, Post, UseGuards, Request, Headers, Req } from '@nestjs/common';
// import type { Request as ExpressRequest } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { PagosService } from './pagos.service';

@Controller('pagos')
export class PagosController {
  constructor(private pagosService: PagosService) {}

  @Post('crear-sesion')
  @UseGuards(AuthGuard('jwt'))
  async crearSesion(@Request() req) {
    return this.pagosService.crearSesionPago(req.user.id, req.user.email);
  }

  @Post('webhook')
  async webhook(
    @Req() req: any, // Use 'any' type for req to access rawBody
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody: Buffer = req.rawBody; // Access the raw body from the request
    return this.pagosService.webHookStripe(rawBody, signature);
  }
}
