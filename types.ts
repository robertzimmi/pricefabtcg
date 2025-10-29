type ResponseData = {
  id: Card[];
}

type Card = {
  id: number;
  blueprint_id: number;
  name_en: string;
  expansion: {
    code: string;
    id: number;
    name_en: string;
  };
  price_cents: number;
  price_currency: string;
  quantity: number;
  description: string;
  properties_hash: {
    condition: string;
    fab_language: string;
    collector_number: string;
    tournament_legal: boolean;
    cmc: string;
    signed: boolean;
    fab_rarity: string;
    fab_foil_new: string;
    altered: boolean;
    first_edition: boolean;
  };
  graded: boolean;
  on_vacation: boolean;
  user: {
    country_code: string;
    too_many_request_for_cancel_as_seller: boolean;
    user_type: string;
    can_sell_sealed_with_ct_zero: boolean;
    max_sellable_in24h_quantity: null | number;
    id: number;
    username: string;
    can_sell_via_hub: boolean;
  };
  price: {
    cents: number;
    currency: string;
    currency_symbol: string;
    formatted: string;
  };
}