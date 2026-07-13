import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor(configService: ConfigService){
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        // PENSAR UNA FORMA PARA seceretar EL JWT_SECRET EN PRODUCCION, POR EJEMPLO USANDO VARIABLES DE ENTORNO O SERVICIOS DE SECRETO DE NUBE
        secretOrKey: configService.get<string>('JWT_SECRET') || '', //si JWT_SECRET no está definido, se usará una cadena vacia (NO RECOMENDABLE PARA PRODUCCION) 
    });
  }


  async validate(payload: any){
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}