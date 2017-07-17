﻿using Microsoft.AspNetCore.Mvc;
using SeattleScotchSociety.ScotchNight.Api.Data;
using SeattleScotchSociety.ScotchNight.Api.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SeattleScotchSociety.ScotchNight.Api.Filters;

namespace SeattleScotchSociety.ScotchNight.Api.Controllers
{
    [Route("api/[controller]")]
    [ValidateModel]
    public class BottlesController : Controller
    {
        private IBottleStore _bottleStore;

        public BottlesController(IBottleStore bottleStore)
        {
            _bottleStore = bottleStore;
        }

        [HttpGet]
        public Task<IEnumerable<Bottle>> GetAllAsync()
        {
            return _bottleStore.GetAllAsync();
        }

        [HttpGet("{id}")]
        public Task<Bottle> Get(string id)
        {
            return _bottleStore.GetAsync(id);
        }

        [HttpPost]
        public async Task<IActionResult> PostAsync([FromBody]Bottle bottle)
        {
            bottle.Id = Guid.NewGuid().ToString();

            await _bottleStore.AddAsync(bottle);

            return Accepted();
        }

        [HttpPut]
        public async Task<IActionResult> PutAsync([FromBody]Bottle bottle)
        {
            await _bottleStore.UpdateAsync(bottle);

            return Accepted();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete([FromBody]Bottle bottle)
        {
            await _bottleStore.DeleteAsync(bottle);

            return Accepted();
        }
    }
}
