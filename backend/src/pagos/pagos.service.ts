import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { UsuariosService } from '../usuarios/usuarios.service';
// import { UsuarioService } from '../usuario/usuarios.service';


@Injectable()
export class PagosService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private usuarioService: UsuariosService,    
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY')!);
  }

  async crearSesionPago(usuarioId: string, email: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'CV Analyzer Pro',
              description: 'Análisis ilimitados y sugerencias detalladas',
            },
            unit_amount: 500, // $5.00
            recurring: { interval: 'month'},
          },
          quantity: 1,
        },
      ],
      metadata: { usuarioId },
      success_url: `${this.configService.get('FRONTEND_URL')}/pago-exitoso`,
      cancel_url: `${this.configService.get('FRONTEND_URL')}/pago-cancelado`,
    });
    
    return { url: session.url };
  }

  async webHookStripe(payload: Buffer, signature: string){
    const webHookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    let event: Stripe.Event;

    try {
        event = this.stripe.webhooks.constructEvent(payload, signature, webHookSecret!);
    } catch (err: any) {
      throw new Error(`Webhook error: ${err.message}`);
    }

    if(event.type === 'checkout.session.completed'){
      const session = event.data.object as Stripe.Checkout.Session;
      const usuarioId = session.metadata?.usuarioId;
      
      if(usuarioId){
        await this.actualizarPlan(usuarioId, 'pro');
      }
    }

    if(event.type === 'customer.subscription.deleted'){
      const subscription = event.data.object as Stripe.Subscription;
      const cliente = await this.stripe.customers.retrieve(subscription.customer as string);

      if('metadata' in cliente ) {
        await this.actualizarPlan(cliente.metadata.usuarioId, 'gratis');
      }
    }

    return { received: true };
  }

  private async actualizarPlan(usuarioId: string, plan: string){
    const usuario = await this.usuarioService.buscar_por_id(usuarioId);

    if(usuario){
      usuario.plan = plan;
      await this.usuarioService.guardarUsuario(usuario);
    }
  }
}
